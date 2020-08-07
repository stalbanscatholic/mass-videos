#!/bin/bash

clear

OUTPUT_PREFIX=wednesday-$(date +%F)
(
    echo file \'/home/ed/Videos/mass/stalbans_logo_5.mp4\'
    for x in "$@"; do
        echo "file '$(readlink -f "$x")'";
    done
    echo file \'/home/ed/Videos/mass/St. Alban Ending Clip.mp4\'
) > $OUTPUT_PREFIX.txt

cat $OUTPUT_PREFIX.txt

ffmpeg -f concat -safe 0 -i $OUTPUT_PREFIX.txt -c copy $OUTPUT_PREFIX.mp4

