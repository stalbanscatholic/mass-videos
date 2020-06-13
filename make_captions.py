#!/usr/bin/env python

import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

from rounded_rectangle import rounded_rectangle

OVERLAY_BACKROUND_ALPHA = math.floor(255 * 0.7)


class TextOverlay(object):
    def __init__(self, text, font=None, image_size=(1920, 1080), padding=42, debug=False):
        self.text = text
        self.font = font
        if self.font is None:
            # get a font
            self.font = ImageFont.truetype('/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf', 42)
        self.image_size = image_size
        self.padding = padding
        self.debug = debug

    def draw_text_image(self):
        image = Image.new('RGBA', self.image_size, (255,255,255,0))
        d = ImageDraw.Draw(image)
        text_width, text_height = d.multiline_textsize(self.text, font=self.font)
        image_width, image_height = self.image_size
        text_upper_right_x = (image_width - text_width) / 2

        if self.debug:
            d.rectangle(
                    [(text_upper_right_x, self.padding * 2), (text_upper_right_x + text_width, self.padding * 2 + text_height + 1)],
                    outline=(255, 0, 0)
                    )

        d.multiline_text(
                (text_upper_right_x, self.padding * 2),
                self.text,
                font=self.font,
                fill=(255,255,255,255),
                align="center",
                )

        return image;
        

    def draw_background(self):
        image = Image.new('RGBA', self.image_size, (0,0,0,0))
        d = ImageDraw.Draw(image)
        text_width, text_height = d.multiline_textsize(self.text, font=self.font)
        image_width, image_height = self.image_size
        text_upper_right_x = (image_width - text_width) / 2

        upper_right = (
                text_upper_right_x - self.padding,
                self.padding,
                )
        lower_left = (
                text_upper_right_x + text_width + self.padding,
                text_height + self.padding * 3,
                )

        rounded_rectangle(
                d,
                [upper_right, lower_left],
                self.padding,
                fill=(0, 0, 0, OVERLAY_BACKROUND_ALPHA)
                )

        # return image.filter(ImageFilter.BoxBlur(2))
        return image.filter(ImageFilter.GaussianBlur(5))
        
    def get_overlay(self):
        return Image.alpha_composite(
                self.draw_background(),
                self.draw_text_image(),
                )

def get_text_overlay(text, font=None, image_size=(1920, 1080), padding=42, debug=False):
    overlay = TextOverlay(text, font=None, image_size=(1920, 1080), padding=42, debug=False)
    return overlay.get_overlay()

TEXT = """
In union, dear Lord, with all the faithful at every altar of thy Church
where the blessed Body and Blood are being offered to the Father,
I desire to offer thee praise and thanksgiving. I believe thou
art truly present in the Most Holy Sacrament.

And since I cannot now receive thee sacramentally, I beseech thee to
come spiritually into my heart. I unite myself unto thee, and embrace thee
with all the affections of my soul. Let me never be separated from thee.
Let me live and die in thy love.

Amen.
""".strip()

def main():
    text_image = get_text_overlay(TEXT)
    text_image.show()
    text_image.save('caption.png')

if __name__ == '__main__':
    main()

