import { PlayerEvent, TextDraw } from "@infernus/core";

export function createTextDrawCommands() {
  const longtd = PlayerEvent.onCommandText("longtd", ({ player, next }) => {
    const st4 =
      "0123456789012345678901234567890123456789~n~012345678901234567890123456789~n~01234567890123456789~n~0123456789~n~0123456789012345678901234567890123456789~n~01234567890123456789~n~01234567890123456789~n~01234567890123456789~n~";
    const st7 = `${st4} ${st4} ${st4}~n~LEN(${st4.length * 3})`;
    const stats = new TextDraw({
      x: 10.0,
      y: 10.0,
      text: st7,
    });
    stats.create();
    stats
      .setTextSize(400.0, 400.0)
      .useBox(false)
      .setBoxColors(0xffffffff)
      .setFont(1)
      .setLetterSize(0.5, 0.5)
      .show(player);
    return next();
  });

  const clicktd = PlayerEvent.onCommandText("clicktd", ({ player, next }) => {
    const txtTestText1 = new TextDraw({
      x: 320.0,
      y: 100.0,
      text: "Test Text 1",
    });
    txtTestText1.create();
    txtTestText1.useBox(true).setBoxColors(0x00000044).setFont(3);
    txtTestText1.setShadow(0); // no shadow
    txtTestText1.setOutline(2); // thickness 1
    txtTestText1.setBackgroundColors(0x000000ff);
    txtTestText1.setColor(0xffffffff);
    txtTestText1.setAlignment(2); // centered
    txtTestText1.setLetterSize(0.5, 1.5);
    txtTestText1.setTextSize(20.0, 200.0); // reverse width and height for rockstar (only for centered td's)
    txtTestText1.setSelectable(true);
    txtTestText1.show(player);

    const txtSprite1 = new TextDraw({
      x: 200.0,
      y: 220.0,
      text: "samaps:map",
    }); // Text is txdfile:texture
    txtSprite1.create();
    txtSprite1.setFont(4); // Font ID 4 is the sprite draw font
    txtSprite1.setColor(0xffffffff);
    txtSprite1.setTextSize(200.0, 200.0); // Text size is the Width:Height
    txtSprite1.setSelectable(true);
    txtSprite1.show(player);

    player.selectTextDraw(0x9999bbbb);
    return next();
  });

  // const playertd = PlayerEvent.onCommandText("playertd", ({ player, subcommand, next }) => {
  //   const playerTestText1 = new TextDraw({
  //     player,
  //     x: 320.0,
  //     y: 100.0,
  //     text: "Test Text 1",
  //   });
  //   playerTestText1.create();
  //   playerTestText1.useBox(true);
  //   playerTestText1.setBoxColors(0x00000044);
  //   playerTestText1.setFont(3);
  //   playerTestText1.setShadow(0); // no shadow
  //   playerTestText1.setOutline(2); // thickness 1
  //   playerTestText1.setBackgroundColors(0x000000ff);
  //   playerTestText1.setColor(0xffffffff);
  //   //PlayerTextDrawAlignment(2); // centered
  //   playerTestText1.setLetterSize(0.5, 1.5);
  //   playerTestText1.setTextSize(50.0, 200.0); // reverse width and height for rockstar (only for centered td's)
  //   playerTestText1.setSelectable(true);
  //   playerTestText1.show(player);

  //   // player.selectTextDraw(0x9999BBBB);
  //   return next();
  // });

  const canceltd = PlayerEvent.onCommandText("canceltd", ({ player, next }) => {
    player.cancelSelectTextDraw();
    return next();
  });

  const txtSpriteTest: TextDraw[] = [];

  const spritetest = PlayerEvent.onCommandText(
    "spritetest",
    ({ player, next }) => {
      txtSpriteTest[0] = new TextDraw({
        x: 100.0,
        y: 100.0,
        text: "ld_grav:timer",
      }); // Text is txdfile:texture
      txtSpriteTest[0].create();
      txtSpriteTest[0].setFont(4); // Font ID 4 is the sprite draw font
      txtSpriteTest[0].setColor(0xffffffff);
      txtSpriteTest[0].setTextSize(100.0, 100.0); // Text size is the Width:Height
      txtSpriteTest[0].show(player);

      txtSpriteTest[1] = new TextDraw({
        x: 200.0,
        y: 100.0,
        text: "ld_grav:bee2",
      }); // Text is txdfile:texture
      txtSpriteTest[1].create();
      txtSpriteTest[1].setFont(4); // Font ID 4 is the sprite draw font
      txtSpriteTest[1].setColor(0xffffffff);
      txtSpriteTest[1].setTextSize(100.0, 100.0); // Text size is the Width:Height
      txtSpriteTest[1].show(player);

      txtSpriteTest[2] = new TextDraw({
        x: 100.0,
        y: 200.0,
        text: "ld_slot:r_69",
      }); // Text is txdfile:texture
      txtSpriteTest[2].create();
      txtSpriteTest[2].setFont(4); // Font ID 4 is the sprite draw font
      txtSpriteTest[2].setColor(0xffffffff);
      txtSpriteTest[2].setTextSize(100.0, 100.0); // Text size is the Width:Height
      txtSpriteTest[2].show(player);

      txtSpriteTest[3] = new TextDraw({
        x: 200.0,
        y: 200.0,
        text: "ld_slot:cherry",
      }); // Text is txdfile:texture
      txtSpriteTest[3].create();
      txtSpriteTest[3].setFont(4); // Font ID 4 is the sprite draw font
      txtSpriteTest[3].setColor(0xffffffff);
      txtSpriteTest[3].setTextSize(100.0, 100.0); // Text size is the Width:Height
      txtSpriteTest[3].show(player);

      txtSpriteTest[4] = new TextDraw({
        x: 100.0,
        y: 300.0,
        text: "ld_card:cd9d",
      }); // Text is txdfile:texture
      txtSpriteTest[4].create();
      txtSpriteTest[4].setFont(4); // Font ID 4 is the sprite draw font
      txtSpriteTest[4].setColor(0xffffffff);
      txtSpriteTest[4].setTextSize(100.0, 100.0); // Text size is the Width:Height
      txtSpriteTest[4].show(player);

      return next();
    },
  );

  const delspritetest = PlayerEvent.onCommandText(
    "delspritetest",
    ({ next }) => {
      txtSpriteTest.forEach((t) => t.isValid() && t.destroy());
      txtSpriteTest.length = 0;
      return next();
    },
  );

  return [longtd, clicktd, canceltd, spritetest, delspritetest];
}
