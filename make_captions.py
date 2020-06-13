#!/usr/bin/env python

import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# https://stackoverflow.com/a/50145023
def rounded_rectangle(self: ImageDraw, xy, corner_radius, fill=None, outline=None):
    upper_left_point = xy[0]
    bottom_right_point = xy[1]
    self.rectangle(
        [
            (upper_left_point[0], upper_left_point[1] + corner_radius),
            (bottom_right_point[0], bottom_right_point[1] - corner_radius)
        ],
        fill=fill,
        outline=outline
    )
    self.rectangle(
        [
            (upper_left_point[0] + corner_radius, upper_left_point[1]),
            (bottom_right_point[0] - corner_radius, bottom_right_point[1])
        ],
        fill=fill,
        outline=outline
    )
    self.pieslice([upper_left_point, (upper_left_point[0] + corner_radius * 2, upper_left_point[1] + corner_radius * 2)],
        180,
        270,
        fill=fill,
        outline=outline
    )
    self.pieslice([(bottom_right_point[0] - corner_radius * 2, bottom_right_point[1] - corner_radius * 2), bottom_right_point],
        0,
        90,
        fill=fill,
        outline=outline
    )
    self.pieslice([(upper_left_point[0], bottom_right_point[1] - corner_radius * 2), (upper_left_point[0] + corner_radius * 2, bottom_right_point[1])],
        90,
        180,
        fill=fill,
        outline=outline
    )
    self.pieslice([(bottom_right_point[0] - corner_radius * 2, upper_left_point[1]), (bottom_right_point[0], upper_left_point[1] + corner_radius * 2)],
        270,
        360,
        fill=fill,
        outline=outline
    )

ImageDraw.rounded_rectangle = rounded_rectangle




overlay_backround_alpha = math.floor(255 * 0.6)

def get_text_overlay(text, font=None, image_size=(1920, 1080), padding=42, debug=False):
    if font is None:
        # get a font
        font = ImageFont.truetype('/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf', 42)

    # make a blank image for the text, initialized to transparent text color
    txt = Image.new('RGBA', image_size, (255,255,255,0))

    # get a drawing context
    d = ImageDraw.Draw(txt)

    # draw text, half opacity
    text_width, text_height = d.multiline_textsize(text, font=font)
    image_width, image_height = image_size

    text_upper_right_x = (image_width - text_width) / 2

    upper_right = (
            text_upper_right_x - padding,
            padding,
            )
    lower_left = (
            text_upper_right_x + text_width + padding,
            text_height + padding * 3,
            )

    rounded_rectangle(
            d,
            [upper_right, lower_left],
            padding,
            fill=(0, 0, 0, overlay_backround_alpha)
            )

    if debug:
        d.rectangle(
                [(text_upper_right_x, padding * 2), (text_upper_right_x + text_width, padding * 2 + text_height + 1)],
                outline=(255, 0, 0)
                )

    d.multiline_text(
            (text_upper_right_x, padding * 2),
            text,
            font=font,
            fill=(255,255,255,255),
            align="center",
            )

    return txt

    # result = Image.alpha_composite(base, txt)
    # return result


def main():
    # get an image
    base = Image.open('kitten.jpg').convert('RGBA')

    text = "\n".join(["Hello", "World"])
    txt = get_text_overlay(text)

    out = Image.alpha_composite(base, txt)

    out.show()

if __name__ == '__main__':
    main()

