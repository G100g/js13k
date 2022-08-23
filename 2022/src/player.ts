import { SpriteClass, SpriteConstructor } from "kontra";

type PlayerProps =
  | ConstructorParameters<SpriteConstructor>[0]
  | { health?: number };

export class PlayerClass extends SpriteClass {
  constructor(props: PlayerProps) {
    super(props);
    this.health = props?.health ?? 100;
  }

  health: number;
}

export const Player = (props: PlayerProps) => {
  return new PlayerClass(props);
};
