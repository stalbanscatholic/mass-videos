#!/usr/bin/env python

import os
from glob import glob
import math

from PIL import Image, ImageDraw, ImageFont, ImageFilter

from rounded_rectangle import rounded_rectangle

OVERLAY_BACKROUND_ALPHA = math.floor(255 * 0.9)
WHITE=(255, 255, 255, 255)
BLACK=(0, 0, 0, 0)

def wrap_line(d, line, font, max_width):
    words = line.split(' ')
    result = ''
    for word in words:
        new_line = False
        width, height = d.multiline_textsize('{} {}'.format(result, word), font=font)
        if width > max_width:
            new_line = True
        result += '{}{}'.format(new_line and '\n' or ' ', word)
    return result.strip()


class TextOverlay(object):
    def __init__(self, text, font=None, image_size=(1920, 1080), padding=42, debug=False):
        self.text = text
        self.font = font
        if self.font is None:
            # get a font
            self.font = ImageFont.truetype('/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf', 42)
        self.image_size = image_size
        self.image_width, self.image_height = self.image_size
        self.padding = padding
        self.debug = debug

        self.wrap_text()

    def make_image(self):
        return Image.new('RGBA', self.image_size, BLACK)

    def wrap_text(self):
        d = ImageDraw.Draw(self.make_image())
        self.text = '\n'.join(
                map(
                    lambda line: wrap_line(d, line, self.font, self.image_width - self.padding*4),
                    self.text.split('\n')
                    )
                )
        self.text_width, self.text_height = d.multiline_textsize(self.text, font=self.font)

    def draw_text_image(self):
        image = self.make_image()
        d = ImageDraw.Draw(image)
        text_upper_right_x = (self.image_width - self.text_width) / 2

        if self.debug:
            d.rectangle(
                    [(text_upper_right_x, self.padding * 2), (text_upper_right_x + self.text_width, self.padding * 2 + self.text_height + 1)],
                    outline=(255, 0, 0)
                    )

        d.multiline_text(
                (text_upper_right_x, self.padding * 2),
                self.text,
                font=self.font,
                fill=WHITE,
                align="center",
                )

        return image;
        

    def draw_background(self):
        image = self.make_image()
        d = ImageDraw.Draw(image)

        text_upper_right_x = (self.image_width - self.text_width) / 2

        upper_right = (
                text_upper_right_x - self.padding,
                self.padding,
                )
        lower_left = (
                text_upper_right_x + self.text_width + self.padding,
                self.text_height + self.padding * 3,
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
    overlay = TextOverlay(text, font, image_size, padding, debug)
    return overlay.get_overlay()

TEXT = """
In union, dear Lord, with all the faithful at every altar of thy Church
where the blessed Body and Blood are being offered to the Father,
I desire to offer thee praise and thanksgiving. I believe thou art
truly present in the Most Holy Sacrament.

And since I cannot now receive thee sacramentally, I beseech thee to
come spiritually into my heart. I unite myself unto thee,
and embrace thee with all the affections of my soul.
Let me never be separated from thee.
Let me live and die in thy love.

Amen.
""".strip()

def split_paragraphs(text):
    return [
        para.replace('\n-\n', '\n\n')
        for para in 
        text.strip().split('\n\n')
    ]

CAPTIONS=[
    """
    The Divine Worship Mass for Corpus Christi 2020 at St. Alban’s Catholic Church,
    a parish community of the Ordinariate of the Chair of St. Peter in Rochester, N.Y.

Please take these few moments to prayerfully prepare for Mass.
    """,
    *split_paragraphs("""
    Psalm 147

Praise the LORD, O Je-rusalem;
praise thy God, O Sion.
For he hath made fast the bars of thy gates,
and hath blessed thy children with-in thee.

He maketh peace in thy borders,
and filleth thee with the flour of wheat.
He sendeth forth his commandment upon earth,
and his word runneth very swiftly.

He showeth his word unto Jacob,
his statutes and ordinances unto Israel.
He hath not dealt so with any nation;
neither have the heathen knowledge of his laws.
    """),
    *split_paragraphs("""
Sequence: Lauda Sion Salvatorem 
St. Thomas Aquinas

Laud, O Sion, thy salvation,
Laud with hymns of exultation
Christ, thy King and Shepherd true:
Spend thyself, his honour raising,
Who surpasseth all thy praising;
Never canst thou reach his due.
-
Sing today, the mystery showing
Of the living, life-bestowing
Bread from heaven before thee set;
E’en the same of old provided,
Where the Twelve, divinely guided,
At the holy Table met.

Full and clear ring out thy chanting,
Joy nor sweetest grace be wanting
To thy heart and soul to-day;
When we gather up the measure
Of that Supper and its treasure,
Keeping feast in glad array.
-
Lo, the new King’s Table gracing,
This new Passover of blessing
Hath fulfilled the elder rite:
Now the new the old effaceth,
Truth revealed the shadow chaseth,
Day is breaking on the night.

What he did at Supper seated,
Christ ordained to be repeated,
His memorial ne’er to cease:
And, his word for guidance taking,
Bread and wine we hallow, making
Thus our Sacrifice of peace.
-
This the truth to Christians given - 
Bread becomes his Flesh from heaven,
Wine becomes his holy Blood.
Doth it pass thy comprehending?
Yet by faith, thy sight transcending,
Wondrous things are understood.

Yea, beneath these signs are hidden
Glorious things to sight forbidden:
Look not on the outward sign.
Wine is poured and Bread is broken,
But in either sacred token
Christ is here by power divine.
-
Whoso of this Food partaketh,
Rendeth not the Lord nor breaketh:
Christ is whole to all that taste.
Thousands are, as one, receivers
One, as thousands of believers,
Takes the Food that cannot waste.

Good and evil men are sharing
One repast, a doom preparing
Varied as the heart of man;
Doom of life or death awarded,
As their days shall be recorded
Which from one beginning ran.
-
When the Sacrament is broken,
Doubt not in each severed token,
Hallowed by the word once spoken,
Resteth all the true content:
Nought the precious Gift divideth,
Breaking but the sign betideth,
He himself the same abideth,
Nothing of his fullness spent.

Lo! the Angels’ Food is given
To the pilgrim who hath striven;
See the children’s Bread from heaven,
Which to dogs may not be cast;
Truth the ancient types fulfilling,
Isaac bound, a victim willing,
Paschal lamb, its life-blood spilling,
Manna sent in ages past.
-
O true Bread, good Shepherd, tend us,
Jesu, of thy love befriend us,
Thou refresh us, thou defend us,
Thine eternal goodness send us
In the land of life to see;

Thou who all things canst and knowest,
Who on earth such Food bestowest,
Grant us with thy Saints, though lowest,
Where the heavenly Feast thou showest,
Fellow-heirs and guests to be.
Amen. Alleluia.

                     """),
    """
    ALMIGHTY God,
Father of our Lord Jesus Christ,
maker of all things, judge of all men:

We acknowledge and bewail our manifold sins and wickedness,
which we from time to time most grievously have committed,
by thought, word, and deed, against thy divine majesty,
provoking most justly thy wrath and indignation against us.
""",
"""
We do earnestly repent,
and are heartily sorry for these our misdoings;
the remembrance of them is grievous unto us,
the burden of them is intolerable.

Have mercy upon us, have mercy upon us,
most merciful Father; for thy Son our Lord Jesus Christ’s sake,
forgive us all that is past; and grant that we may ever hereafter
serve and please thee in newness of life,
to the honour and glory of thy Name;
through Jesus Christ our Lord.

Amen.
    """,
    """
    We do not presume to come to this thy Table, O merciful Lord,
    trusting in our own righteousness, but in thy manifold and great mercies.
    We are not worthy so much as to gather up the crumbs under thy Table.
    But thou art the same Lord whose property is always to have mercy.

Grant us therefore, gracious Lord, so to eat the flesh of thy dear Son
Jesus Christ, and to drink his Blood, that our sinful bodies may be
made clean by his Body, and our souls washed through his most precious Blood,
and that we may evermore dwell in him, and he in us.

Amen.
    """,
    TEXT,
    *split_paragraphs("""
    ALMIGHTY and everliving God,
we most heartily thank thee for that thou dost feed us,
in these holy mysteries, with the spiritual food of
the most precious Body and Blood of thy Son our Saviour Jesus Christ;
and dost assure us thereby of thy favour and goodness towards us;
and that we are very members incorporate in the mystical body of thy Son,
the blessed company of all faithful people;
and are also heirs, through hope, of thy everlasting kingdom,
by the merits of the most precious death and Passion of thy dear Son.

And we humbly beseech thee, O heavenly Father,
so to assist us with thy grace,
that we may continue in that holy fellowship,
and do all such good works
as thou hast prepared for us to walk in;
through Jesus Christ our Lord,
to whom, with thee and the Holy Spirit,
be all honour and glory, world without end.
-
Amen.
    """),
    """
    We processed around the building,
    to an altar set up behind the church.
    """,
    """
    We processed back into the church.
    """
]

def main():
    for font_path in glob('fonts/*'):
        for i, caption in enumerate(CAPTIONS):
            name = os.path.basename(font_path[:-4])
            font = ImageFont.truetype(font_path, 42)
            text_image = get_text_overlay(caption, font=font)
            text_image.save('caption-{}-{}.png'.format(i, name))

if __name__ == '__main__':
    main()

