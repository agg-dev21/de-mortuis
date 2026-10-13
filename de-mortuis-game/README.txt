DE MORTUIS - game folder
========================

de-mortuis.html   Playable game. Keep it next to the img/ folder.
de-mortuis.twee   The source. Import into Twine: Library > Import > pick this file.
img/              Background photos (your campus shots, resized to 1600px).

WHICH PHOTO IS WHERE
  Backgrounds are plain photos only, with no characters in them. The characters will be
  shown as separate sprites on top (see characters/POSES.txt).
  room-mc.jpg              your room by day (waking up)
  room-mc-night.jpg        your room at night: night texts, Day 6 scrolling, She Waits ending
  room-naomi.jpg           Naomi's room (made from Iris's tidy room, mirrored and warm)
  between-1/2/3.jpg        Death's voice: revival, Day 7 morning / "one more time" / All Three ending
  room-iris.jpg            Iris's room by day (Days 1-6)
  room-iris-2.jpg          Iris's room at night (Day 2 confession, Day 3 evening, Day 6 night)
  room-iris-bw.jpg         swaps in for both of the above whenever Iris is losing herself (meter under 35)
  room-iris-clean.jpg      Day 7 night: desk cleared, walls bare (edited from the original)
  room-iris-clean-night.jpg  2:07, lights off, phone glowing on the carpet
  gallery.jpg / -night     Day 1, Day 3 art hallway, middle ending / Maeve's date
  library.jpg              Naomi's table
  cafe.jpg                 Naomi's café, Day 7 morning
  classroom.jpg            Day 2, Day 3 seminar, Day 5 Naomi in room 204
  lab.jpg / lab-night      Day 1 evening, Day 3 morning, Day 4 / Day 4 night with Iris
  lounge.jpg               Iris, Days 3-4
  stairwell.jpg            the printouts (Day 4), Naomi (Day 5)
  vending.jpg              Maeve: Day 2, Day 3 date offer, the final scene, good-ending reveal
  bench.jpg / -night       Day 6 alone with Maeve / Day 6 night
  hall-white.jpg / -night  every "go alone" scene with Maeve (night version on Day 3 evening)
  hall-red.jpg             every walk home
  hall-posters.jpg         hallway scenes, Days 1-6
  hall-brick.jpg           hallway scenes, Day 7 afternoon
  fountain.jpg             Naomi, Day 1
  stairs-yellow.jpg        good ending

CHANGING OR ADDING ENVIRONMENTS
  1. Save the picture into img/ (the Environment Editor does this). Any name works,
     e.g. img/library-night.jpg.
  2. If anyone changed the story in Twine: Twine > Build > Export as Twee, save it over
     de-mortuis.twee in this folder first, so their edits aren't lost.
  3. Double-click "Update Story Images". It embeds every picture in img/ into the story
     (so Twine's Play/Test shows them), gives new pictures a tag, and rebuilds
     de-mortuis.html. It keeps the previous story file as de-mortuis.twee.bak.
  4. In Twine: Library > Import > de-mortuis.twee > replace.
  5. Tag a passage with the picture's tag to use it: library-night.jpg -> bg-library-night.
     Add the tag "night" or "day" too, to darken or lighten it.

DESKTOP APPS
  Double-click "Environment Editor" or "Character Studio" in this folder. Each opens in its
  own window and saves straight into img/ (environments) or characters/ (sprites,
  characters/projects for projects). Character Studio autosaves every minute.
  Needs Node.js (installed) and Edge or Chrome. Closing the window stops it.
  The HTML files in tools/ also still work on their own in a browser.

TOOLS (tools/ - open in Chrome or Edge, work offline)
  environment-editor.html  Turn photos into scenes. One preset per game location (also sets
                           the save name), clone/blur/cover tools for posters and names,
                           image layers for photobashing, batch "night versions".
                           Click "Connect game img folder" and choose img/ to save straight in.
  character-studio.html    Finish characters with a mouse. Open your sketch, Crop one
                           character, "Extract lines" + "Extract flat colours", then
                           "Add shadows". Smoothed tapered pen, symmetry, bucket fill that
                           ignores small gaps, lasso fill, pose mannequin, palettes from
                           your designs. Export PNG; Save project keeps all layers.
  Your design sheets are in characters/refs/.

HOW A DAY WORKS
  You type your name first; Maeve uses it.
  Days 1-5: a morning scene, then three scenes with Iris, Naomi, or go alone (Maeve finds you),
  the walk home, night texts, and the meters. Choice wording warms toward whoever you've chosen more.
  Big choices (meters shown on screen): Day 3 morning (who you go to), Day 5 (Naomi wants to speak
  up in class), Day 6 (who you spend your last day with).
  Day 6 cut-off: a girl under 15 can't be saved, 15-39 means middle ending at best.
  Day 7: Death's last warning, Naomi in the morning, Iris in the afternoon, Iris's room at night.
  You must ask Iris directly for the good ending. Then Maeve at the vending machine, and the ending.
  Ignore both girls and go on Maeve's Day 3 date: you die, Death sends you back once, remembering.
  Date her again on that second run and you stay with her for good.

FONTS (fonts/)
  Story and choices: BIZ UDMincho. Day titles: Aurora. Rumours and meters: DK Jambo.
  Death's voice: Extra Blur. A girl losing herself: Megalomania.
  Iris doing better: Stay With Me. Naomi doing better: Reenie Beanie (embedded, works offline).

SOUND (sounds/)
  music.mp3   "Sad Lofi" by prettyjohn1 (Pixabay). Loops under every normal scene.
  piano.mp3   "Sad Piano" (freesound community, Pixabay). Replaces the lofi on passages
              tagged "piano": the prologue and every ending.
  rain.mp3    "Calming Rain" by liecio (Pixabay). Added on passages tagged "rain":
              the prologue and the bad ending. Re-cut so it loops seamlessly.
  buzz.mp3    phone buzz (freesound community). Plays when a passage shows an incoming
              text, twice if there are several.
  whoosh.mp3  creepy whoosh (freesound community). Plays when Death breaks in and when
              you arrive in the between.
  Tag a passage "silence" to fade everything out (2:07 on Day 7, Maeve's last scene).
  Nothing plays before the first click (browsers block it); the corner button mutes it all.
  All are free to use under the Pixabay licence, no credit required.
  Like the photos, sound only plays in the published HTML, not in Twine's Play/Test.

NOTES
- In Twine's own Play/Test window the photos won't load (it can't see the img/ folder).
  Publish to File, save the HTML into this folder, and open it from here.
- Meter values, starting numbers and every +/-10 live in the twee. Search "set: $iris" or "set: $naomi".
