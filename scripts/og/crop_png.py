#!/usr/bin/env python3
"""Crop, and optionally downscale, a non-interlaced 8-bit PNG.

Headless Chrome writes a screenshot as tall as --window-size even though it only
paints the (shorter) viewport, so the generated images need their unpainted
bottom strip removed. It also refuses to open very small windows, so the small
icon is rendered large and scaled down here. Only the subset of PNG that Chrome
emits is supported.

Usage: crop_png.py FILE CROP_W CROP_H [SCALE_W SCALE_H]
"""

import struct
import sys
import zlib


def chunks(data):
    offset = 8
    while offset < len(data):
        (length,) = struct.unpack(">I", data[offset : offset + 4])
        kind = data[offset + 4 : offset + 8]
        body = data[offset + 8 : offset + 8 + length]
        yield kind, body
        offset += 12 + length


def build_chunk(kind, body):
    return (
        struct.pack(">I", len(body))
        + kind
        + body
        + struct.pack(">I", zlib.crc32(kind + body) & 0xFFFFFFFF)
    )


def undo_filter(rows, width, channels):
    out = []
    previous = bytearray(width * channels)
    for filter_type, row in rows:
        line = bytearray(row)
        for i in range(len(line)):
            left = line[i - channels] if i >= channels else 0
            up = previous[i]
            upper_left = previous[i - channels] if i >= channels else 0
            if filter_type == 0:
                pass
            elif filter_type == 1:
                line[i] = (line[i] + left) & 0xFF
            elif filter_type == 2:
                line[i] = (line[i] + up) & 0xFF
            elif filter_type == 3:
                line[i] = (line[i] + (left + up) // 2) & 0xFF
            elif filter_type == 4:
                p = left + up - upper_left
                pa, pb, pc = abs(p - left), abs(p - up), abs(p - upper_left)
                if pa <= pb and pa <= pc:
                    predictor = left
                elif pb <= pc:
                    predictor = up
                else:
                    predictor = upper_left
                line[i] = (line[i] + predictor) & 0xFF
            else:
                raise ValueError(f"unsupported PNG filter {filter_type}")
        out.append(line)
        previous = line
    return out


def downscale(pixels, width, height, channels, target_width, target_height):
    """Area-average resize. Good enough for flat artwork and needs no dependencies."""
    scaled = []
    for out_y in range(target_height):
        y0 = out_y * height // target_height
        y1 = max(y0 + 1, (out_y + 1) * height // target_height)
        row = bytearray(target_width * channels)
        for out_x in range(target_width):
            x0 = out_x * width // target_width
            x1 = max(x0 + 1, (out_x + 1) * width // target_width)
            count = (y1 - y0) * (x1 - x0)
            for channel in range(channels):
                total = 0
                for y in range(y0, y1):
                    source = pixels[y]
                    for x in range(x0, x1):
                        total += source[x * channels + channel]
                row[out_x * channels + channel] = total // count
        scaled.append(row)
    return scaled


def write_png(path, pixels, width, height, depth, colour, compression, filter_method):
    body = b"".join(b"\x00" + bytes(row) for row in pixels)
    header = struct.pack(">IIBBBBB", width, height, depth, colour, compression, filter_method, 0)
    out = b"\x89PNG\r\n\x1a\n"
    out += build_chunk(b"IHDR", header)
    out += build_chunk(b"IDAT", zlib.compress(body, 9))
    out += build_chunk(b"IEND", b"")
    with open(path, "wb") as handle:
        handle.write(out)


def process(path, crop_width, crop_height, scale_width=None, scale_height=None):
    with open(path, "rb") as handle:
        data = handle.read()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"{path} is not a PNG")

    header = None
    payload = b""
    for kind, body in chunks(data):
        if kind == b"IHDR":
            header = body
        elif kind == b"IDAT":
            payload += body

    width, height, depth, colour, compression, filter_method, interlace = struct.unpack(
        ">IIBBBBB", header
    )
    if depth != 8 or interlace != 0 or colour not in (2, 6):
        raise ValueError(f"{path}: unsupported PNG variant")
    if crop_width > width or crop_height > height:
        raise ValueError(
            f"{path}: cannot crop {width}x{height} up to {crop_width}x{crop_height}"
        )

    channels = 3 if colour == 2 else 4
    stride = width * channels
    raw = zlib.decompress(payload)
    rows = [
        (raw[i * (stride + 1)], raw[i * (stride + 1) + 1 : (i + 1) * (stride + 1)])
        for i in range(height)
    ]

    pixels = undo_filter(rows, width, channels)
    pixels = [row[: crop_width * channels] for row in pixels[:crop_height]]
    out_width, out_height = crop_width, crop_height

    if scale_width and scale_height and (scale_width, scale_height) != (crop_width, crop_height):
        pixels = downscale(pixels, crop_width, crop_height, channels, scale_width, scale_height)
        out_width, out_height = scale_width, scale_height

    write_png(path, pixels, out_width, out_height, depth, colour, compression, filter_method)


if __name__ == "__main__":
    process(*([sys.argv[1]] + [int(value) for value in sys.argv[2:]]))
