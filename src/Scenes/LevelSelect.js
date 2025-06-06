class LevelSelect extends Phaser.Scene {
    constructor() {
        super("levelSelect");
    }

    create() {
        console.log("Switched to LevelSelect successfully!");

        this.cameras.main.setBackgroundColor('#1d1d1d');

        this.add.text(this.scale.width / 2, 100, 'Select a Level', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Level 1
        const level1Text = this.add.text(this.scale.width / 2, 200, 'Level 1', {
            fontSize: '24px',
            fill: '#00ff00'
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              this.scene.start('platformerScene');
          });

        // Level 2
        const level2Text = this.add.text(this.scale.width / 2, 260, 'Level 2', {
            fontSize: '24px',
            fill: '#00ff00'
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              this.scene.start('platformerScene2');
          });

        const goBack = this.add.text(this.scale.width / 2, 320, 'Go Back', {
            fontSize: '24px',
            fill: '#00ff00'
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              this.scene.start('mainMenu');
          });

        // highlight on hover
        [level1Text, level2Text, goBack].forEach(text => {
            text.on('pointerover', () => text.setStyle({ fill: '#ffff00' }));
            text.on('pointerout', () => text.setStyle({ fill: text === level1Text ? '#00ff00' : '#00ff00' }));
        });
    }
}