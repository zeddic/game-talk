import * as Phaser from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
  title: 'Test Game',
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  scale: {
      mode: Phaser.Scale.NONE,
      autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  // parent: 'canvas', // <-- readd once css is setup for index page
  backgroundColor: '#000000',
};

export const game = new Phaser.Game(config);