class Credits extends Phaser.Scene {
    constructor() {
        super("credits");
    }

    create() {
        console.log("Switched to Credits successfully!");

        this.cameras.main.setBackgroundColor('#1d1d1d');

        this.add.text(this.scale.width / 2, 100, 'Game Created by Matthew Peters', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, 200, 'Created using Phaser 3 and Kenneys asset packs', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const level2Text = this.add.text(this.scale.width / 2, 260, 'Go Back', {
            fontSize: '24px',
            fill: '#00ff00'
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              this.scene.start('mainMenu');
          });
    }
}