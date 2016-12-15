/**
 * PhysicsJS by Jasper Palfree <wellcaffeinated.net>
 * http://wellcaffeinated.net/PhysicsJS
 */
Physics.behavior('demo-mouse-events', function( parent ){
  
  return {
    
    init: function( options ){
      
      var self = this;
      
      this.mousePos = Physics.vector();
      this.mousePosOld = Physics.vector();
      this.offset = Physics.vector();
      
      this.el = $(options.el).on({
        mousedown: function(e){
          
          var offset = $(this).offset();
          self.mousePos.set(e.pageX - offset.left, e.pageY - offset.top);
          
          var body = self._world.findOne({ $at: self.mousePos }) ;
          if ( body ){
            
            // we're trying to grab a body
            
            // fix the body in place
            body.fixed = true;
            // remember the currently grabbed body
            self.body = body;
            // remember the mouse offset
            self.offset.clone( self.mousePos ).vsub( body.state.pos );
            return;
          }
          
          self.mouseDown = true;
        },
        mousemove: function(e){
          var offset = $(this).offset();
          self.mousePosOld.clone( self.mousePos );
          // get new mouse position
          self.mousePos.set(e.pageX - offset.left, e.pageY - offset.top);
        },
        mouseup: function(e){
          var offset = $(this).offset();
          self.mousePosOld.clone( self.mousePos );
          self.mousePos.set(e.pageX - offset.left, e.pageY - offset.top);
          
          // release the body
          if (self.body){
            self.body.fixed = false;
            self.body = false;
          }
          self.mouseDown = false;
        }
      });
    },
    
    connect: function( world ){
      
      // subscribe the .behave() method to the position integration step
      world.subscribe('integrate:positions', this.behave, this);
    },
    
    disconnect: function( world ){
      
      // unsubscribe when disconnected
      world.unsubscribe('integrate:positions', this.behave);
    },
    
    behave: function( data ){
      
      if ( this.body ){
        
        // if we have a body, we need to move it the the new mouse position.
        // we'll also track the velocity of the mouse movement so that when it's released
        // the body can be "thrown"
        this.body.state.pos.clone( this.mousePos ).vsub( this.offset );
        this.body.state.vel.clone( this.body.state.pos ).vsub( this.mousePosOld ).vadd( this.offset ).mult( 1 / 30 );
        this.body.state.vel.clamp( { x: -1, y: -1 }, { x: 1, y: 1 } );
        return;
      }
      
      if ( !this.mouseDown ){
        return;
      }
      
      // if we don't have a body, then just accelerate
      // all bodies towards the current mouse position
      
      var bodies = data.bodies
      // use a scratchpad to speed up calculations
      ,scratch = Physics.scratchpad()
      ,v = scratch.vector()
      ,body
      ;
      
      for ( var i = 0, l = bodies.length; i < l; ++i ){
        
        body = bodies[ i ];
        
        // simple linear acceleration law towards the mouse position
        v.clone(this.mousePos)
        .vsub( body.state.pos )
        .normalize()
        .mult( 0.001 )
        ;
        
        body.accelerate( v );
      }
      
      scratch.done();
    }
  };
});

Physics(function(world){
  
  var $win = $(window)
  ,viewWidth = $win.width()
  ,viewHeight = Math.max($win.height(), 360)
  ,renderer = Physics.renderer('canvas', {
    el: 'viewport',
    width: viewWidth,
    height: viewHeight,
    meta: false,
    // debug:true,
    styles: {
      
      'convex-polygon' : {
        strokeStyle: 'hsla(26, 100%, 34%, 1)',
        lineWidth: 1,
        fillStyle: 'hsla(26, 100%, 54%, 1)',
        angleIndicator: 'none'
      }
    }
  })
  ,edgeBounce
  // bounds of the window
  ,viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight - 12)
  ,square = [
    { x: 0, y: 6 },
    { x: 10, y: 6 },
    { x: 10, y: 0 },
    { x: 0, y: 0 }
  ]
  ;
  
  // resize events
  $(window).on('resize', function(){
    
    viewWidth = $win.width();
    viewHeight = Math.max($win.height(), 360);
    
    renderer.el.width = viewWidth;
    renderer.el.height = viewHeight;
    
    renderer.options.width = viewWidth;
    renderer.options.height = viewHeight;
    
    viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight - 12);
    edgeBounce.setAABB( viewportBounds );
    
  });
  
  // add the renderer
  world.add( renderer );
  // render on each step
  world.subscribe('step', function(){
    world.render();
  });
  
  // constrain objects to these bounds
  edgeBounce = Physics.behavior('edge-collision-detection', {
    aabb: viewportBounds,
    restitution: 0.0,
    cof: 1
  });
  
  world.add( Physics.behavior('demo-mouse-events', { el: '#viewport' }) );
  
  world.add( Physics.integrator('verlet', { drag: 0.003 }) );

  function lerp(a, b, p) {
    return (b-a)*p + a;
  }
  /*
        Example adapted from VerletJS
        https://github.com/subprotocol/verlet-js/blob/master/examples/tree.html
        @license MIT
     */
  // create a fractal tree
  var generateTree = function(pos, depth, branchLength, segmentCoef, theta) {
    
    var nodes = []
    ,constraints = Physics.behavior('verlet-constraints', {
      iterations: 2
    })
    ,origin = { x: viewWidth/2 + pos.x, y: viewHeight + pos.y }
    ;
    
    // set up the base and root to define an angle constraint upwards to keep the tree upright
    var base = Physics.body('circle', {
      x: origin.x,
      y: origin.y,
      radius: 0.1,
      fixed: true,
      hidden: true,
      mass: 100
    });
    
    var root = Physics.body('circle', {
      x: origin.x,
      y: origin.y - 10,
      radius: 0.1,
      fixed: true,
      hidden: true,
      mass: 100
    });
    
    $(window).on('resize', function(){
      base.state.pos.set(viewWidth/2 + pos.x, viewHeight + pos.y);
      root.state.pos.set(viewWidth/2 + pos.x, viewHeight + pos.y - 10);
    });
    
    nodes.push( base, root );
    
    // recursive function to create branches
    var branch = function(parent, i, nMax, branchVec) {
      var particle = Physics.body('circle', { radius: 30, hidden: true, mass: 0.04 * branchVec.normSq() });
      particle.state.pos.clone( parent.state.pos ).vadd( branchVec );
      nodes.push( particle );
      
      constraints.distanceConstraint(parent, particle, 0.7);
      
      if (i < nMax) {
        var trans = Physics.transform( false, -theta, particle.state.pos );
        var a = branch(particle, i + 1, nMax, branchVec.rotate( trans ).mult( segmentCoef * segmentCoef ).clone());
        var b = branch(particle, i + 1, nMax, branchVec.rotate( trans.setRotation( 2 * theta ) ).clone());
        
        var jointStrength = lerp(0.7, 0, i/nMax);
        constraints.angleConstraint(parent, particle, a, jointStrength);
        constraints.angleConstraint(parent, particle, b, jointStrength);
      } else {
        
        var leaf = Physics.body('convex-polygon', { vertices: square, mass: 1, angle: Math.random() });
        leaf.state.pos.clone( particle.state.pos );
        constraints.distanceConstraint(particle, leaf, .1);
        leaf.leaf = true;
        leaf.attached = true;
        nodes.push( leaf );
      }
      
      return particle;
    };
    
    var firstBranch = branch(root, 0, depth, Physics.vector(0, -branchLength));
    constraints.angleConstraint(base, root, firstBranch, 1);
    
    // add the constraints to the array so that the whole shebang can be added with world.add
    nodes.push( constraints );
    nodes.constraints = constraints;
    return nodes;
  };
  
  // add wind
  Physics.behavior('wind', function( parent ){
    return {
      init: function( options ){
        parent.init.call(this, options);
        
        this.theta = 0;
        this.jitter = options.jitter || 1;
        this.radius = options.radius || 100;
        this.strength = options.strength || 0.000005;
        this.ground = options.ground;
      },
      behave: function( data ){
        var bodies = data.bodies
        ,scratch = Physics.scratchpad()
        ,dir = scratch.vector()
        ,tmp = scratch.vector()
        ,filter = this.filterType
        ,body
        ,mul = this.jitter * Math.PI * 2
        ,r = this.radius * this.strength
        ,cutoff = this.ground - 20
        ;
        
        for (var i = 0, l = bodies.length; i < l; i++){
          body = bodies[ i ];
          this.theta += (Math.random() - 0.5) * mul;
          if (body.leaf){
            
            if (body.attached){
              tmp.zero();
            } else {
              tmp.set(Math.random()-0.5, Math.random()-0.5).mult( r * 1000 );
            }
            
            if (cutoff && body.state.pos.get(1) < cutoff){
              
              body.applyForce( dir.clone({ x: Math.cos( this.theta ) * r, y: Math.sin( this.theta ) * r - (0.0004 - 0.00004) * body.mass }), tmp );
            }
          }
        }
        
        scratch.done();
      }
    };
  });
  
  var init = function(){
    var treeProps = [
      
      [{ x: 0, y: - 10 }, 6, 70, 0.92, (Math.PI/2)/3]
      
    ];
    
    if (viewWidth > 720){
      treeProps.push(
        [{ x: 250, y: - 10 }, 5, 40, 0.9, (Math.PI/2)/3],
        [{ x: -250, y: - 10 }, 3, 50, 0.95, (Math.PI/1)/5]
      );
    }
    
    // create three trees
    Physics.util.each(treeProps, function( params ){
      
      var tree = generateTree.apply(this, params);
      world.add( tree );
      
      // handle detaching the leaves
      world.subscribe('integrate:positions', function(){
        
        var constrs = tree.constraints.getConstraints().distanceConstraints,
        c,
        threshold = 0.35,
        leaf;
        
        for ( var i = 0, l = constrs.length; i < l; ++i ){
          
          c = constrs[ i ];
          
          if ( c.bodyA.leaf ){
            leaf = c.bodyA;
          } else if ( c.bodyB.leaf ){
            leaf = c.bodyB;
          } else {
            leaf = false;
          }
          
          if ( leaf && (leaf.state.vel.norm() > threshold && Math.random() > 0.99 || Math.random() > 0.9999) ){
            
            tree.constraints.remove( c );
            leaf.state.vel.zero();
            leaf.attached = false;
          }
        }
        
        // higher priority than constraint resolution
      }, null, 100);
      
      // render the branches
      world.subscribe('beforeRender', function( data ){
        
        var renderer = data.renderer,
        constrs = tree.constraints.getConstraints().distanceConstraints,
        c;
        
        for ( var i = 0, l = constrs.length; i < l; ++i ){
          
          c = constrs[ i ];
          renderer.drawLine(c.bodyA.state.pos, c.bodyB.state.pos, {
            strokeStyle: '#543324',
            lineCap: 'round',
            lineWidth: c.targetLength * c.targetLength * 0.0016
          });
        }
      });
    });
  };
  
  $(function(){
    setTimeout(init, 300);
  });
  
  var wind;
  // add gravity
  world.add( Physics.behavior('constant-acceleration') );
  world.add( edgeBounce );
  world.add( Physics.behavior('body-impulse-response') );
  world.add( wind = Physics.behavior('wind', { ground: viewHeight }) );
  
  $(window).on('resize', function(){
    wind.ground = viewHeight;
  });
  
  // subscribe to ticker to advance the simulation
  Physics.util.ticker.subscribe(function( time, dt ){
    
    world.step( time );
  });
  
  // start the ticker
  Physics.util.ticker.start();
  
  $(function(){
    $win.trigger('resize'); 
  });
});