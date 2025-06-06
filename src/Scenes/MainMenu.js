class MainMenu extends Phaser.Scene {
    constructor() {
        super("mainMenu");
    }

    create() {
        console.log("Switched to Main Menu successfully!");

        this.cameras.main.setBackgroundColor('#1d1d1d');

        this.add.text(this.scale.width / 2, 100, 'Little Chudies Grand Adventure Deluxe', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const level1Text = this.add.text(this.scale.width / 2, 200, 'Start', {
            fontSize: '24px',
            fill: '#00ff00'
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              this.scene.start('levelSelect');
          });

        const level2Text = this.add.text(this.scale.width / 2, 260, 'Credits', {
            fontSize: '24px',
            fill: '#00ff00'
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              this.scene.start('credits');
          });

        // highlight on hover
        [level1Text, level2Text].forEach(text => {
            text.on('pointerover', () => text.setStyle({ fill: '#ffff00' }));
            text.on('pointerout', () => text.setStyle({ fill: text === level1Text ? '#00ff00' : '#00ff00' }));
        });
    }
}