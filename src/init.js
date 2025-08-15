function velocidadRandom() {
    let velocidadX = Phaser.Math.Between(300, 300);
    let velocidadY = Phaser.Math.Between(300, 300);
    velocidadX *= Phaser.Math.Between(0, 1) ? 1 : -1;
    velocidadY *= Phaser.Math.Between(0, 1) ? 1 : -1;
    return { x: velocidadX, y: velocidadY };
}

const config = {
    title: "BlastPong",
    type: Phaser.AUTO,
    parent: "contenedor",
    width: 800,
    height: 600,
    backgroundColor: "#8F8F8F", 
    
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },

    scene: {
        preload,
        create,
        update,
    }
     
};

 var game = new Phaser.Game(config);

function preload (){

    this.load.image('mesa', 'assets/fondo/mesa.png');
    this.load.image('paleta', 'assets/paleta/paleta.png');
    this.load.image('pelota', 'assets/pelota/bola.png');
    this.load.audio('sonido', 'assets/sonido/golpe.mp3')
    
};
function create (){
    fondo = this.add.image(400, 300, 'mesa');

    //pelota de ping pong
    posicionInicialPelota = { x: 400, y: 250 };
    pelota = this.physics.add.image(posicionInicialPelota.x, posicionInicialPelota.y, 'pelota');
    pelota.setScale(0.10);
    pelota.setCollideWorldBounds(true);
    pelota.setBounce(1);
    let vel = velocidadRandom();
    pelota.setVelocity(vel.x, vel.y);

    this.physics.world.on('worldbounds', function(body) {
    if (body.gameObject === pelota) {
        // La pelota tocó los límites, la reseteamos
        pelota.setVelocity(0, 0);
        pelota.setPosition(posicionInicialPelota.x, posicionInicialPelota.y);

        //velocidad inicial para que vuelva a jugar
        let vel = velocidadRandom();
        pelota.setVelocity(vel.x, vel.y);
    }
    }, this);
    

    //paleta izquierda
    paletaIzquierda = this.physics.add.image(50, 300, 'paleta').setImmovable();
    paletaIzquierda.setAngle(-90);
    paletaIzquierda.setImmovable(true);
    paletaIzquierda.body.setOffset(0, 0);
    paletaIzquierda.setScale(0.75);
     

    //paleta derecha
    paletaDerecha = this.physics.add.image(750, 300, 'paleta').setImmovable();
    paletaDerecha.setAngle(-90);
    paletaDerecha.setImmovable(true);
    paletaDerecha.body.setOffset(0, 0);
    paletaDerecha.setScale(0.75)


    //buscar letra
    const KeyCodes = Phaser.Input.Keyboard.KeyCodes;
    console.log(KeyCodes);

    //teclas para pc
    this.teclas = this.input.keyboard.addKeys({
    arriba: 'W',
    abajo: 'S',
    arribaDer: Phaser.Input.Keyboard.KeyCodes.UP,
    abajoDer: Phaser.Input.Keyboard.KeyCodes.DOWN
    });

     // Controles táctiles para movil
    this.controles = {
        arriba: false,
        abajo: false,
        arribaDer: false,
        abajoDer: false
    };

    const addTouchControl = (id, key) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener("touchstart", () => this.controles[key] = true);
            btn.addEventListener("touchend", () => this.controles[key] = false);
        }
    };

    addTouchControl("arriba", "arriba");
    addTouchControl("abajo", "abajo");
    addTouchControl("arribaDer", "arribaDer");
    addTouchControl("abajoDer", "abajoDer");
    

    // Limitar a los bordes del mundo
    this.physics.world.setBoundsCollision(false, false, true, true);

    //sonido de cuando golpea en paleta 
    const efecto = this.sound.add('sonido');

     // Colisión pelota con paleta izquierda
    this.physics.add.collider(pelota, paletaIzquierda,  () => {
        efecto.play();
    });

    // Colisión pelota con paleta derecha
    this.physics.add.collider(pelota, paletaDerecha, () => {
        efecto.play();
    });
    



    
    
};
function update(time, delta){
   
const velocidad = 7;

     // Paleta izquierda (teclado o táctil)
    if (this.teclas.arriba.isDown || this.controles.arriba) {
        paletaIzquierda.y -= velocidad;
    }
    if (this.teclas.abajo.isDown || this.controles.abajo) {
        paletaIzquierda.y += velocidad;
    }

    // Paleta derecha (teclado o táctil)
    if (this.teclas.arribaDer.isDown || this.controles.arribaDer) {
        paletaDerecha.y -= velocidad;
    }
    if (this.teclas.abajoDer.isDown || this.controles.abajoDer) {
        paletaDerecha.y += velocidad;
    }

    //Evita que las paletas se salgan de la pantalla (limita su posición vertical)
    paletaIzquierda.y = Phaser.Math.Clamp(paletaIzquierda.y, 50, 550);
    paletaDerecha.y = Phaser.Math.Clamp(paletaDerecha.y, 50, 550);

    // Reinicia la pelota a la posición inicial con velocidad aleatoria si sale del área del juego
    if (pelota.x < 0 || pelota.x > 800 || pelota.y < 0 || pelota.y > 600) {
        pelota.setVelocity(0, 0);
        pelota.setPosition(posicionInicialPelota.x, posicionInicialPelota.y);

        let vel = velocidadRandom();
        pelota.setVelocity(vel.x, vel.y);
    }

}; 