import torch
import torch.nn as nn
import torch.nn.functional as F

class ResidualBlock(nn.Module):
    def __init__(self, in_channels, out_channels):
        super().__init__()
        self.conv1 = nn.Conv3d(in_channels, out_channels, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm3d(out_channels)
        self.conv2 = nn.Conv3d(out_channels, out_channels, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm3d(out_channels)
        self.relu = nn.ReLU(inplace=True)
        self.shortcut = nn.Sequential(
            nn.Conv3d(in_channels, out_channels, kernel_size=1),
            nn.BatchNorm3d(out_channels)
        ) if in_channels != out_channels else nn.Identity()

    def forward(self, x):
        residual = self.shortcut(x)
        x = self.relu(self.bn1(self.conv1(x)))
        x = self.bn2(self.conv2(x))
        x += residual
        return self.relu(x)
    
class AttentionGate(nn.Module):
    def __init__(self, x_channels, g_channels):
        super().__init__()
        self.W_x = nn.Conv3d(x_channels, g_channels, kernel_size=1)
        self.W_g = nn.Conv3d(g_channels//2, g_channels, kernel_size=1)
        self.psi = nn.Conv3d(g_channels, 1, kernel_size=1)
        self.relu = nn.ReLU(inplace=True)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x, g):
        x1 = self.W_x(x)
        g1 = self.W_g(g)
        if g1.shape[2:] != x1.shape[2:]:
            g1 = F.interpolate(g1, size=x1.shape[2:], mode='trilinear', align_corners=False)
        psi = self.relu(x1 + g1)
        psi = self.sigmoid(self.psi(psi))
        return x * psi

class Encoder(nn.Module):
    def __init__(self):
        super().__init__()
        self.init_conv = nn.Sequential(
            nn.Conv3d(4, 24, kernel_size=3, padding=1),
            nn.BatchNorm3d(24),
            nn.ReLU(inplace=True),
            nn.Conv3d(24, 24, kernel_size=3, padding=1),
            nn.BatchNorm3d(24),
            nn.ReLU(inplace=True)
        )
        self.down_blocks = nn.ModuleList([
            nn.Sequential(
                nn.MaxPool3d(2),
                ResidualBlock(24, 48),
                ResidualBlock(48, 48)
            ),
            nn.Sequential(
                nn.MaxPool3d(2),
                ResidualBlock(48, 96),
                ResidualBlock(96, 96)
            ),
            nn.Sequential(
                nn.MaxPool3d(2),
                ResidualBlock(96, 192),
                ResidualBlock(192, 192)
            )
        ])
        self.final_down = nn.Sequential(
            nn.MaxPool3d(2),
            ResidualBlock(192, 192)
        )

    def forward(self, x):
        skips = []
        x = self.init_conv(x)
        skips.append(x)  # [24, 128, 128, 128]
        for block in self.down_blocks:
            x = block(x)
            skips.append(x)  # [48, 64, 64, 64], [96, 32, 32, 32], [192, 16, 16, 16]
        x = self.final_down(x)  #[192, 8, 8, 8]
        return x, skips
    
class ChiefDecoder(nn.Module):
    def __init__(self, skip_channels):
        super().__init__()
        self.up_blocks = nn.ModuleList()
        self.attention_gates = nn.ModuleList()
        self.projectors = nn.ModuleList()

        in_channels = 192
        for skip_ch in reversed(skip_channels):  #[192, 96, 48, 24]
            self.attention_gates.append(AttentionGate(skip_ch, in_channels))
            self.projectors.append(nn.Conv3d(skip_ch, in_channels//2, kernel_size=1))
            self.up_blocks.append(nn.Sequential(
                nn.ConvTranspose3d(in_channels, in_channels//2, kernel_size=2, stride=2),
                ResidualBlock(in_channels//2, in_channels//2)
            ))
            in_channels = in_channels // 2

        self.final_conv = nn.Conv3d(12, 4, kernel_size=3, padding=1)

    def forward(self, x, skips):
        reversed_skips = list(reversed(skips))  # [192, 96, 48, 24]
        for i, (gate, up_block, proj) in enumerate(zip(self.attention_gates, self.up_blocks, self.projectors)):
            x = up_block(x)  # Upsample
            skip = reversed_skips[i]
            skip = gate(skip, x)  # Apply attention
            skip = proj(skip)  # Project skip to match decoder channels
            # print(x.shape, skip.shape)
            x = x + skip  # Add attended skip (no concatenation)
        x = self.final_conv(x)
        return F.sigmoid(x.permute(0, 2, 3, 4, 1).unsqueeze(1))  # [_,1,128,128,128,4]
    
class VAEDecoder(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc = nn.Linear(192*8*8*8, 256)
        self.mu = nn.Linear(256, 128)
        self.logvar = nn.Linear(256, 128)
        self.decoder = nn.Sequential(
            nn.Linear(128, 256*8*8*8),
            nn.Unflatten(1, (256, 8, 8, 8)),
            nn.Conv3d(256, 256, kernel_size=3, padding=1),
            nn.Upsample(scale_factor=2, mode='trilinear'),
            nn.Conv3d(256, 128, kernel_size=3, padding=1),
            nn.Upsample(scale_factor=2, mode='trilinear'),
            nn.Conv3d(128, 64, kernel_size=3, padding=1),
            nn.Upsample(scale_factor=2, mode='trilinear'),
            nn.Conv3d(64, 4, kernel_size=3, padding=1)
        )

    def reparameterize(self, mu, logvar):
        std = torch.exp(0.5*logvar)
        eps = torch.randn_like(std)
        return mu + eps*std

    def forward(self, x):
        x = torch.flatten(x, start_dim=1)
        x = F.relu(self.fc(x))
        mu, logvar = self.mu(x), self.logvar(x)
        z = self.reparameterize(mu, logvar)
        return self.decoder(z), mu, logvar
    
class BrainTumorSegModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.encoder = Encoder()
        self.chief_decoder = ChiefDecoder(skip_channels=[24, 48, 96, 192])
        self.vae_decoder = VAEDecoder()

    def forward(self, x):
        x, skips = self.encoder(x)
        seg_out = self.chief_decoder(x, skips)
        recon_out, mu, logvar = self.vae_decoder(x)
        return seg_out, recon_out, mu, logvar 