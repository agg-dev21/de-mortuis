DE MORTUIS - game folder
========================

de-mortuis.html   Playable game. Keep it next to the img/ folder.
de-mortuis.twee   The source. Import into Twine: Library > Import > pick this file.
img/              Background photos (your campus shots, resized to 1600px).

ROOM PHOTOS STILL NEEDED
Drop these into img/ with exactly these names. Until then those scenes show a dark background.
  room-mc.jpg          your room            (prologue, Day 6 night, She Waits ending)
  room-iris.jpg        Iris's room, messy   (Days 1-6)
  room-iris-clean.jpg  Iris's room, very neat and cleared (Day 7 - this is a clue, keep it tidy)
  room-naomi.jpg       Naomi's room         (Days 4, 6)

WHICH PHOTO IS WHERE
  gallery.jpg        Day 1 campus, Maeve's date, Day 7 morning, middle ending
  library.jpg        Naomi's table (Days 1, 3)
  cafe.jpg           Naomi's café (Day 2, Day 5)
  classroom.jpg      Day 2 opening, Day 4 Naomi
  lab.jpg            Day 1 evening, Day 3 opening, Day 4 night with Iris
  vending.jpg        Maeve (Day 2 night, good-ending reveal)
  bench.jpg          Maeve, Day 6 night
  stairwell.jpg      Naomi, Day 5
  hall-white.jpg     spare (tag a passage bg-hall-white to use it)
  lounge.jpg         Day 4 Iris
  hall-red.jpg       every walk home
  hall-posters.jpg   Day 4 opening, Day 6 afternoon
  hall-brick.jpg     Day 5 afternoon, Day 7 morning
  stairs-yellow.jpg  good ending only
  fountain.jpg       spare

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
  Morning: Iris or Naomi. Then three scenes, each with Iris, Naomi, or go alone (Maeve finds you).
  Then the walk home (Iris, Naomi or alone), night texts, and the meters.
  Choice wording turns warmer for whichever girl you've spent more time with, colder for the other.
  Big choices: Day 3 morning (who you go to), Day 3 night (whether Iris tells you about her mom),
  Day 7 afternoon (who you spend the last afternoon with).
  Ignore both girls and go on Maeve's Day 3 date: you die, Death sends you back once, remembering.
  Date her again on that second run and you stay with her for good.

FONTS (fonts/)
  Story and choices: BIZ UDMincho. Day titles: Aurora. Rumours and meters: DK Jambo.
  Death's voice: Extra Blur. A girl losing herself: Megalomania.
  Iris doing better: Stay With Me. Naomi doing better: Reenie Beanie (embedded, works offline).

NOTES
- In Twine's own Play/Test window the photos won't load (it can't see the img/ folder).
  Publish to File, save the HTML into this folder, and open it from here.
- Meter values, starting numbers and every +/-10 live in the twee. Search "set: $iris" or "set: $naomi".
