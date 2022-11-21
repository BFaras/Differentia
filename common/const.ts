// ChronometerService constants
export const ONE_SECOND = 1000;
export const HALF_A_SECOND = 500;
export const MAX_TIME = 59;
export const BASE_ONE = 10;
// Image constants
export const DEFAULT_WIDTH_CANVAs = 640;
export const DEFAULT_HEIGHT_CANVAS = 480;

export const RESET_VALUE = 0;

// pop-up-validate number unavailable

export const ZERO_RADIUS = 0;
export const FIFTEEN_RADUIS = 15;

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

//Differences found constants
export const NO_DIFFERENCE_FOUND_ARRAY: number[] = [];

//Images constants
export const IMAGE_WIDTH = 640;
export const IMAGE_HEIGHT = 480;
export const CORRECT_BIT_DEPTH = 24;
export const DEFAULT_OFFSET = 3;
export const MINIMUM_PIXEL_POSITION = 0;
export const CORRECT_IMAGE_FORMAT = 'image/bmp';

//constantes message quand add game

export const MESSAGE_JEU_NON_CREER = "le jeu n'a pas été créer";
export const MESSAGE_JEU_CREER = 'Le jeu a été créer ';
export const MESSAGE_NOMBRE_DIFFERENCE_ERREUR = "Attention!! le nombre de difference n'est pas entre 3 et 9";

export const ORIGINAL_IMAGE_POSITION = 0;
export const MODIFIED_IMAGE_POSITION = 1;

//nom image
export const ORIGINAL_IMAGE_NAME: string = 'Image Original';
export const MODIFIED_IMAGE_NAME: string = 'Image Modifié ';

//Arrays constants
export const EMPTY_ARRAY_LENGTH = 0;
export const FIRST_ARRAY_POSITION = 0;
//width Pencil constants

export const VERY_SMALL = 3;
export const SMALL = 6;
export const MEDIUM = 9;
export const BIG = 12;
export const VERY_BIG = 15;

//color
export const BLACK_COLOR = '#000';

//Game sockets constantes
export const GAME_ROOM_GENERAL_ID = 'GameRoom';
export const NO_OTHER_PLAYER_ROOM = '';
export const DEFAULT_GAME_ROOM_NAME = GAME_ROOM_GENERAL_ID + 'EASJDS';

//Player usernames constants
export const LOCAL_PLR_USERNAME_POS = 0;
export const ADVERSARY_PLR_USERNAME_POS = 1;
//Player constants
export const DEFAULT_USERNAME = 'anonyme';

//Messages constants
export const GAME_MESSAGE_SENDER_NAME = 'Game';
export const MESSAGE_ERROR_DIFFERENCE_SOLO = 'Erreur, aucune nouvelle différence trouvée!';
export const MESSAGE_DIFFERENCE_FOUND_SOLO = 'Vous avez trouver une différence!';
export const MESSAGE_DIFFERENCE_FOUND_MULTI = 'Différence trouvée par ';
export const MESSAGE_ERROR_DIFFERENCE_MULTI = 'Erreur par ';
export const TWO_DIGIT_TIME_VALUE = '2-digit';
export const MESSAGE_INDICE = 'Indice utilisé';

//End game messages
export const CLASSIC_SOLO_END_GAME_MESSAGE = 'Vous avez trouvé toutes les différences!';
export const CLASSIC_MULTIPLAYER_REAL_WIN_MESSAGE = 'Vous avez gagnez contre votre adversaire!';
export const CLASSIC_MULTIPLAYER_ABANDON_WIN_MESSAGE = 'Votre adversaire a abandonné, donc vous avez gagner!';
export const CLASSIC_MULTIPLAYER_LOST_MESSAGE = 'Vous avez perdu contre votre adversaire :(';
export const ABANDON_MESSAGE = ' a abandonné la partie';

//Constantes des indices
export const CLUE_AMOUNT_DEFAULT = 3;
export const FIRST_CLUE_NB = CLUE_AMOUNT_DEFAULT;
export const SECOND_CLUE_NB = FIRST_CLUE_NB - 1;
export const FIRST_CLUE_QUANDRANT_NB = 4;
export const SECOND_CLUE_QUANDRANT_NB = 16;

// Constantes de touches
export const CHEAT_KEY: string = 'document:keyup.t';
export const CLUE_KEY: string = 'document:keyup.i';
export const CONTROL_Z_SHORTCUT: string = 'document:keyup.control.z';
export const CONTROL_SHIFT_Z_SHORTCUT: string = 'document:keyup.control.shift.z';

// Write constante
export const WRITE_MODE: string = 'write';
