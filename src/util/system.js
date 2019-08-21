import myShader from "../shaders/display.frag.glsl"
const glslify = require("glslify")
const THREE = require( "three" );


class System{
  constructor( canvas ){
    this.setupTHREE( canvas );
    this.textureSize = 400;
    var renderTargets = this.createRenderTargets( this.textureSize );

    var shaderTextContents = {
      velocityVertex: require('../shaders/velocity.vert.glsl').default.toString(),
      velocityFragment: require('../shaders/velocity.frag.glsl').default.toString(),
      positionVertex: require('../shaders/position.vert.glsl').default.toString(),
      positionFragment: require('../shaders/position.frag.glsl').default.toString(),
      displayVertex: require('../shaders/display.vert.glsl').default.toString(),
      displayFragment: require('../shaders/display.frag.glsl').default.toString(),
      randomVertex: require('../shaders/random.vert.glsl').default.toString(),
      randomFragment: require('../shaders/random.frag.glsl').default.toString()
    };

    const glsl = require('glslify')

    var uniforms = {
      velocity: this.createVelocityUniforms(renderTargets),
      position: this.createPositionUniforms(renderTargets),
      display: this.createDisplayUniforms(renderTargets),
      random: this.createRandomUniforms(),
    };

    var shaderMaterials = this.createShaderMaterials(shaderTextContents, uniforms);

    this.scenes = {
      velocity: new THREE.Scene(),
      position: new THREE.Scene(),
      display: this.three.scene,
      random: new THREE.Scene()
    }

    this.scenes.velocity.add( this.createMesh( this.textureSize, shaderMaterials.velocity ));
    this.scenes.position.add( this.createMesh( this.textureSize, shaderMaterials.position ));
    this.scenes.random.add( this.createMesh( this.textureSize, shaderMaterials.random ));

    this.pointCloud = this.createPoints( this.textureSize, shaderMaterials.display );
    this.three.renderer.render( this.scenes.random, this.three.camera, renderTargets.velocity[0]);
    this.three.renderer.render( this.scenes.random, this.three.camera, renderTargets.position[0]);

  }

  createPoints(size, material){
    var points = new THREE.Geometry();
    for (var i = 0; i < size * size; i++) {
      var pos = new THREE.Vector3((i % size)/size, Math.floor(i/size)/size , 0);
      points.vertices.push(pos);
    }
    return new THREE.Points(points, material);


  }

  createShaderMaterials(shaders, uniforms, displayMaterialOptions){

    displayMaterialOptions = displayMaterialOptions || {
      transparent: true,
      wireframe: false,
      blending: THREE.NormalBlending,
      depthWrite: false
    };

    return {
      velocity: this.createShaderMaterial(shaders.velocityVertex, shaders.velocityFragment, uniforms.velocity),
      position: this.createShaderMaterial(shaders.positionVertex, shaders.positionFragment, uniforms.position),
      display: this.createShaderMaterial(shaders.displayVertex, shaders.displayFragment, uniforms.display, displayMaterialOptions),
      random: this.createShaderMaterial(shaders.randomVertex, shaders.randomFragment, uniforms.random)
    };
  };

  createMesh( size, material ){
    return new THREE.Mesh(
      new THREE.PlaneBufferGeometry( size, size ),
      material
    );
  }

  createShaderMaterial( vShader, fShader, uniforms ){
    var defaults = {
      uniforms: uniforms,
      vertexShader: vShader,
      fragmentShader: fShader
    };
    return new THREE.ShaderMaterial(defaults);
  };

  createRandomUniforms(){
    return {
      explodeRate: {type: "f", value: 0}
    };
  };

  createVelocityUniforms(renderTargets, targetPosition, targetTexture, gravityFactor){
    return {
      velTex: {type: "t", value: renderTargets.velocity[0]},
      posTex: {type: "t", value: renderTargets.position[0]},
      targetTex: {type: "t", value: targetTexture},
      targetPosition: {type: "v3", value: new THREE.Vector3( 0, 0, 0 ) },
      useTargetTexture: {type: "i", value: !!targetTexture ? 1 : 0},
      gravityFactor: {type: "f", value: 0}
    };
  };

  createPositionUniforms( renderTargets ){
    return {
      velTex: {type: "t", value: renderTargets.velocity[0]},
      posTex: {type: "t", value: renderTargets.position[0]}
    };
  }

  createDisplayUniforms( renderTargets ){
    return {
      pointSize: {type: "f", value: 1},
      posTex: {type: "t", value: renderTargets.position[0]},
      targetPosition: {type: "v3", value: new THREE.Vector3( 0, 0, 0 ) },
      alpha: {type: "f", value: 0.5}
    };
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
