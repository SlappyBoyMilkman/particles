const THREE = require( "three" );

class System{
  constructor( canvas ){
    this.setupTHREE( canvas );
    this.textureSize = 400;
    var renderTargets = this.createRenderTargets( this.textureSize );

    var shaderTextContents = {
      velocityVertex: require('raw!./shaders/velocity.vert.glsl'),
      velocityFragment: require('raw!./shaders/velocity.frag.glsl'),
      positionVertex: require('raw!./shaders/position.vert.glsl'),
      positionFragment: require('raw!./shaders/position.frag.glsl'),
      displayVertex: require('raw!./shaders/display.vert.glsl'),
      displayFragment: require('raw!./shaders/display.frag.glsl'),
      randomVertex: require('raw!./shaders/random.vert.glsl'),
      randomFragment: require('raw!./shaders/random.frag.glsl')
    };
    debugger

  }

  createRenderTargets(size, options){
    return {
      velocity: [
        this.createRenderTarget(size, options),
        this.createRenderTarget(size, options)
      ],
      position: [
        this.createRenderTarget(size, options),
        this.createRenderTarget(size, options)
      ]
    };
  };

  createRenderTarget( size, options ){
    options = options || {
    format: THREE.RGBFormat,
    generateMipmaps: false,
    magFilter: THREE.NearestFilter,
    minFilter: THREE.NearestFilter,
    type: THREE.HalfFloatType
  };
  return new THREE.WebGLRenderTarget(size, size, options);
  }

  setupTHREE( canvas ){
    let renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setClearColor("black");
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( canvas.offsetWidth, canvas.offsetHeight );
    let camera = new THREE.PerspectiveCamera( 35, canvas.offsetWidth / canvas.offsetHeight );
    let scene = new THREE.Scene();
    this.three = { camera: camera, renderer: renderer, scene: scene }


  }
}

export default System
