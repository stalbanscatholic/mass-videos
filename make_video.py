import os
import glob

import ffmpeg

MASS_VIDEOS_DIR = '/Users/edbrannin/Movies/Mass Videos'

# https://video.stackexchange.com/questions/12105/add-an-image-overlay-in-front-of-video-using-ffmpeg

def input(f, parent_dir=MASS_VIDEOS_DIR, loop_frames=None):
    stream = ffmpeg.input(os.path.join(parent_dir, f))
    if loop_frames:
        print('Looping {} frames of {}'.format(loop_frames, f))
        stream = ffmpeg.filter(stream, 'loop', size=loop_frames)
    return stream

def mass_part_inputs(parent_dir):
    # TODO: Use regex for case-insensitive match
    files = glob.glob(os.path.join(parent_dir, '*.MP4'))
    return [
        input(f, parent_dir)
        for f
        in sorted(files)
    ]

def main():
    mass_parts = mass_part_inputs(os.path.join(MASS_VIDEOS_DIR, '2020-05-23'))

    # TODO Read from mass video
    FRAME_RATE = 25

    # Before/after
    before_logo = input('stalbans_logo_5.mp4')
    after_screen = input('after-message.png', loop_frames=FRAME_RATE * 30)

    # Superimposed bits
    announcements = input('announcements-background.png')
    offertory = input('offertory-background.png')

    print(before_logo)
    # print(mass_parts)
    print(after_screen)

    split_last_mass_part = ffmpeg.filter_multi_output(mass_parts[-1], 'split')
    mass_parts[-1] = split_last_mass_part.stream(0)
    last_mass_part_fade = split_last_mass_part.stream(1)
    # ffmpeg.concat(split0, split1).output('out.mp4').run() 


    print(mass_parts[-1])
    mass_parts[-1] = ffmpeg.trim(mass_parts[-1], end=10)
    print(mass_parts[-1])

    result = ffmpeg.concat(
        mass_parts[-1],
        # ffmpeg.filter([last_mass_part_fade, after_screen], 'xfade'),

        after_screen,
    ).output('out.mp4')
    print(' '.join(ffmpeg.get_args(result)))
    result.run()

if __name__ == '__main__':
    main()
