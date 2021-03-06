import * as PIXI from 'pixi.js';
import Stats from 'stats.js';
import {CollisionSystem} from './collision/collision_system';
import {Input} from './input';
import {GameState} from './models/game_state';
import {Player} from './player';
import {Ship} from './ship';
import {World} from './world';

/**
 * The number of milliseconds that should be simulated in each update
 * step within the game loop.
 */
const FIXED_UPDATE_STEP_MS = 1000 / 60;

/**
 * The maximum number of updates to perform per frame.
 */
const MAX_UPDATES_PER_TICK = 10;

export class Game {
  private stats: Stats;
  private graphics: PIXI.Graphics;
  private renderer: PIXI.Renderer;

  state: GameState;
  ships: Ship[] = [];
  collisionSystem!: CollisionSystem;
  world!: World;
  player!: Player;

  constructor(readonly loader: PIXI.Loader) {
    // Setup FPS stats
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);

    // Setup PIXI Renderer
    this.renderer = new PIXI.Renderer({
      width: 1000,
      height: 800,
    });
    document.body.appendChild(this.renderer.view);

    // State
    const stage = new PIXI.Container();
    const bounds = appRegion(this.renderer.view);
    this.graphics = new PIXI.Graphics();
    this.state = new GameState(bounds, stage, new Input());
    this.state.stage.addChild(this.graphics);
  }

  public start() {
    this.loader.load(() => {
      this.setup();
      this.startGameLoop();
    });
  }

  private startGameLoop() {
    let lastTimestamp = performance.now();
    let accumlator = 0;

    const step = () => {
      this.stats.begin();

      requestAnimationFrame(step);

      const now = performance.now();
      const delta = Math.min(now - lastTimestamp, 1000);
      accumlator += delta;

      let updates = 0;
      while (
        accumlator > FIXED_UPDATE_STEP_MS &&
        updates < MAX_UPDATES_PER_TICK
      ) {
        this.update(FIXED_UPDATE_STEP_MS / 1000);
        accumlator -= FIXED_UPDATE_STEP_MS;
        updates++;
      }

      this.render();
      lastTimestamp = now;
      this.stats.end();
    };

    requestAnimationFrame(step);
  }

  private setup() {
    // Collision detection.
    this.world = new World(this.state.bounds, this.loader);
    this.collisionSystem = new CollisionSystem(this.world);

    this.player = new Player(this.state);
    this.player.x;
    this.collisionSystem.add(this.player);

    // for (let i = 0; i < 20; i++) {
    //   const ship = new Ship(this.state);
    //   ship.p.x = randomInt(0, this.renderer.view.width);
    //   ship.p.y = randomInt(0, this.renderer.view.height);
    //   ship.v.x = randomInt(-70, 70);
    //   ship.v.y = randomInt(-70, 70);
    //   ship.rotation = randomInt(0, 360);
    //   this.ships.push(ship);
    // }

    const ship = new Ship(this.state);
    ship.p.set(200, 350);
    ship.v.set(-30, -30);
    this.ships.push(ship);
    // ship.v.x = randomInt(-70, 70);
    // ship.v.y = randomInt(-70, 70);

    this.collisionSystem.addAll(this.ships);
  }

  /**
   * Updates the game by one simulation step.
   * @param delta The number of seconds since the last call to update.
   */
  private update(delta: number) {
    for (const ship of this.ships) {
      ship.update(delta);
      this.collisionSystem.move(ship);
    }

    this.player.update(delta);
    this.collisionSystem.move(this.player);

    this.world.update(delta);
    this.collisionSystem.resolveCollisions();
  }

  /**
   * Renders the game.
   */
  private render() {
    this.graphics.clear();

    this.world.render(this.graphics);

    for (const ship of this.ships) {
      ship.render(this.graphics);
    }
    this.player.render(this.graphics);

    this.collisionSystem.render(this.graphics);

    this.renderer.render(this.state.stage);
  }
}

function appRegion(view: HTMLCanvasElement) {
  return {left: 0, top: 0, right: view.width, bottom: view.height};
}

export interface GameState2 {}
