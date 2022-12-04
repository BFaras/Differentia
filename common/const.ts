import { Position } from './position';

// ChronometerService constants
export const ONE_SECOND = 1000;
export const HALF_A_SECOND = 500;
export const MAX_TIME = 59;

// Image constants
export const DEFAULT_WIDTH_CANVAs = 640;
export const DEFAULT_HEIGHT_CANVAS = 480;
export const RESET_VALUE = 0;

// Pop-up-validate number unavailable
export const ZERO_RADIUS = 0;
export const FIFTEEN_RADUIS = 15;

// Constantes concernant les différents modes de jeu
export const CLASSIC_MODE = 'Classic mode';
export const LIMITED_TIME_MODE = 'Limited time mode';

// Differences constants
export const NB_BIT_PER_PIXEL = 4;
export const RED_POS = 0;
export const GREEN_POS = 1;
export const BLUE_POS = 2;
export const ALPHA_POS = 3;
export const BLACK_RGB = 0;
export const ALPHA_OPAQUE = 255;
export const MAX_RGB_VALUE = 255;
export const DEFAULT_DIFFERENCE_POSITION = -1;
export const RADIUS_AROUND_PIXEL = 1;
export const UP = -1;
export const DOWN = 1;
export const DEFAULT_NB_OF_DIFFERENCES = 0;
export const EMPTY_OFFSET_NB = 0;

// Differences found constants
export const NO_DIFFERENCE_FOUND_ARRAY: number[] = [];

// Images constants
export const IMAGE_WIDTH = 640;
export const IMAGE_HEIGHT = 480;
export const CORRECT_BIT_DEPTH = 24;
export const DEFAULT_OFFSET = 3;
export const MINIMUM_PIXEL_POSITION = 0;
export const CORRECT_IMAGE_FORMAT = 'image/bmp';

// Constantes message quand add game
export const MESSAGE_JEU_NON_CREER = "le jeu n'a pas été créer";
export const MESSAGE_JEU_CREER = 'Le jeu a été créer ';
export const MESSAGE_NOMBRE_DIFFERENCE_ERREUR = "Attention!! le nombre de difference n'est pas entre 3 et 9";
export const ORIGINAL_IMAGE_POSITION = 0;
export const MODIFIED_IMAGE_POSITION = 1;

//nom image
export const ORIGINAL_IMAGE_NAME: string = 'Image originale';
export const MODIFIED_IMAGE_NAME: string = 'Image modifiée ';

//Arrays constants
export const EMPTY_ARRAY_LENGTH = 0;
export const FIRST_ARRAY_POSITION = 0;

// Width pencil constants
export const VERY_SMALL = 3;
export const SMALL = 6;
export const MEDIUM = 9;
export const BIG = 12;
export const VERY_BIG = 15;

// Color
export const BLACK_COLOR = '#000';

// Game sockets constantes
export const GAME_ROOM_GENERAL_ID = 'GameRoom';
export const NO_OTHER_PLAYER_ROOM = '';
export const DEFAULT_GAME_ROOM_NAME = GAME_ROOM_GENERAL_ID + 'EASJDS';

// Player usernames constants
export const LOCAL_PLR_USERNAME_POS = 0;
export const ADVERSARY_PLR_USERNAME_POS = 1;

// Player constants
export const DEFAULT_USERNAME = 'anonyme';

// Constante pour le host
export const HOST_PRESENT = true;

//Messages constants
export const GAME_MESSAGE_SENDER_NAME = 'Game';
export const MESSAGE_ERROR_DIFFERENCE_SOLO = 'Erreur, aucune nouvelle différence trouvée!';
export const MESSAGE_DIFFERENCE_FOUND_SOLO = 'Vous avez trouver une différence!';
export const MESSAGE_DIFFERENCE_FOUND_MULTI = 'Différence trouvée par ';
export const MESSAGE_ERROR_DIFFERENCE_MULTI = 'Erreur par ';
export const TWO_DIGIT_TIME_VALUE = '2-digit';
export const MESSAGE_INDICE = 'Indice utilisé';

//Constantes des indices
export const CLUE_AMOUNT_DEFAULT = 3;
export const FIRST_CLUE_NB = CLUE_AMOUNT_DEFAULT;
export const SECOND_CLUE_NB = FIRST_CLUE_NB - 1;
export const FIRST_CLUE_QUANDRANT_NB = 4;
export const SECOND_CLUE_QUANDRANT_NB = 16;
export const CARDINAL_DIRECTION_RAD_ANGLE = Math.PI / 4;
export const CIRCLE_CIRCONFERENCE = Math.PI * 2;
export const MIDDLE_OF_IMAGE_POSITION: Position = {
    x: IMAGE_WIDTH / 2,
    y: IMAGE_HEIGHT / 2,
};

// Constantes de touches
export const CHEAT_KEY: string = 'document:keyup.t';
export const CLUE_KEY: string = 'document:keyup.i';
export const CONTROL_Z_SHORTCUT: string = 'document:keyup.control.z';
export const CONTROL_SHIFT_Z_SHORTCUT: string = 'document:keyup.control.shift.z';

// Write constante
export const WRITE_MODE: string = 'write';

// Constante pour reset de tous les tableaux de temps
export const MSG_RESET_TIME = 'Le tableau des temps records a été réinitalisé pour le jeu: ';
export const MSG_RESET_ALL_TIME = 'Le tableau des temps records a été réinitalisé pour tous les jeux';
