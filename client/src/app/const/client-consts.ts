// Constantes du game Form components
export const ADMIN_GAME_FORMS_BUTTON = ['Supprimer', 'Réinitialiser'];
export const SELECTION_GAME_FORMS_BUTTON = ['Créer', 'Jouer', 'Joindre'];
export const MULTIPLAYER_MODE = true;
export const SOMEBODY_IS_WAITING = true;
export const CREATE_FLAG = true;
export const JOIN_FLAG = true;

// Contantes de temps de jeu par défault
export const DEFAULT_INITIAL_TIME = 30;
export const DEFAULT_PENALTY_TIME = 5;
export const DEFAULT_SAVED_TIME = 5;
export const INITIAL_TIME_INDEX = 0;
export const PENALTY_TIME_INDEX = 1;
export const SAVED_TIME_INDEX = 2;

export const MINIMUM_INITIAL_TIME = 15;
export const MINIMUM_PENALTY_TIME = 2;
export const MINIMUM_SAVED_TIME = 2;

export const MAXIMUM_INITIAL_TIME = 120;
export const MAXIMUM_PENALTY_TIME = 30;
export const MAXIMUM_SAVED_TIME = 30;
export const TIME_RATIO = 4;

export const EMPTY_TIME = '';
export const MSG_PENALTY_TIME_RATIO = 'Le temps de pénalité ne doit pas dépasser le quart du temps initial';
export const MSG_SAVED_TIME_RATIO = 'Le temps gagné ne doit pas  dépasser le quart du temps initial';
export const MSG_ALL_TIME_RATIO = 'Le temps de pénalité et le temps gagné ne doivent pas dépasser le quart du temps initial';

// Constantes vérification jeu avant upload
export const MINIMUM_NB_DIFFERENCES = 3;
export const MAXIMUM_NB_DIFFERENCES = 9;

// Constantes pour drawWord
export const STEP = 20;

// Constantes concernant les dimensions des pop-up
export const STANDARD_POP_UP_HEIGHT = '400px';
export const STANDARD_POP_UP_WIDTH = '600px';
export const DISABLE_CLOSE = true;
export const CLASSIC_FLAG = true;

// Constantes des noms de la page principale
export const MAIN_PAGE_BUTTONS = ['Mode classique', 'Temps limité', 'Administration'];

// Constantes pour les bouttons des pop-up
export const DISABLE_BUTTON = true;

// Constantes pour la validation du username
export const USERNAME_NOT_VALID = true;

// Constantes pour le pop-up de temps limité
export const EMPTY_GAME_NAME = '';

// Constantes pour le pop-up d'attente de joueur
export const SOMEONE_IS_JOINING = true;
export const EMPTY_PLAYER_NAME = '';

// Option de jouer en multijoueur
export const MULTI_FLAG = true;

// Constante pour le service de chat
export const GAME_MESSAGE_SENDER_NAME = 'Game';
export const MESSAGE_ERROR_DIFFERENCE_SOLO = 'Erreur, aucune nouvelle différence trouvée!';
export const MESSAGE_DIFFERENCE_FOUND_SOLO = 'Vous avez trouver une différence!';
export const MESSAGE_DIFFERENCE_FOUND_MULTI = 'Différence trouvée par ';
export const MESSAGE_ERROR_DIFFERENCE_MULTI = 'Erreur par ';
export const MESSAGE_CLUE = 'Indice utilisé';
export const TWO_DIGIT_TIME_VALUE = '2-digit';

// Message pour la fin de partie
export const CLASSIC_SOLO_END_GAME_MESSAGE = 'Vous avez trouvé toutes les différences!';
export const CLASSIC_MULTIPLAYER_REAL_WIN_MESSAGE = 'Vous avez gagnez contre votre adversaire!';
export const CLASSIC_MULTIPLAYER_ABANDON_WIN_MESSAGE = 'Votre adversaire a abandonné, donc vous avez gagner!';
export const CLASSIC_MULTIPLAYER_LOST_MESSAGE = 'Vous avez perdu contre votre adversaire :(';
export const ABANDON_MESSAGE = ' a abandonné la partie';
export const TIMER_HIT_ZERO_MESSAGE = 'Le temps est arrivé à zéro, vous avez perdu...';
export const ALL_GAMES_FINISHED = 'Vous avez fini tous les jeux disponibles! Vous avez gagné!';
export const RECORD_END_GAME_MESSAGE_PART_ONE = 'Bravo ';
export const RECORD_END_GAME_MESSAGE_PART_TWO = ', vous avez gagné et obtenu la place numéro ';
export const RECORD_END_GAME_MESSAGE_PART_THREE = ' au classement!';

// Decision si victoire ou defaite
export const WIN_FLAG = true;
export const LOSING_FLAG = false;

// Temps choisi avant le mineuteur s arr'te
export const THREE_SECONDS = 3000;

// Contantes pour le clignotement
export const BLINK_ID = 'blink';
export const PAUSED_ID = 'paused';

// Time service constants
export const BASE_ONE = 10;
export const EMPTY_SHOWABLE_TIME = '';
export const LESS_THAN_10 = 5;
export const MORE_THAN_9 = 10;

// Constantes pour ListGameForms
export const FIRST_GAMEFORMS_INDEX = 0;
export const LAST_GAMEFORMS_INDEX = 3;
export const EMPTY_MESSAGE = '';
export const SNACKBAR_DURATION = 4000;
export const SNACKBAR_HORIZONTAL_POSITION = 'center';
export const SNACKBAR_VERTICAL_POSITION = 'top';
export const RESET_MSG_GAME_LIST = 'La liste des jeux a été réinitialisé :(';

// Constantes pour réinitialisation des données
export const RESET_INFO_CONSTANTS = 'Constantes de temps de jeu';
export const RESET_INFO_RECORDS_TIME = 'Table des meilleurs temps de jeu';

// Constantes pour nouveau records
export const MESSAGE_RECORD_PART_ONE = ' obtient la place n°';
export const MESSAGE_RECORD_PART_TWO = ' dans les meilleurs temps du jeu ';
export const MESSAGE_RECORD_SOLO = ' en solo';
export const MESSAGE_RECORD_MULTI = ' en multijoueur';
export const NO_AVAILABLE = 0;

// Constantes pour les indices
export const COMPASS_IMAGES_BASIC_PATH = 'assets/compass-images/compass';
export const COMPASS_WIDTH = 130;
export const COMPASS_HEIGHT = 120;
export const NO_OFFSET = 0;
export const CLUE_MIDDLE_COMPASS_OFFSET_X = COMPASS_WIDTH + 30;
export const COMPASS_BLINK_MILISECONDS = 1500;
export const PNG_FILE_TYPE_SRC = '.png';
export const COMPASS_CLUE_ID = 'compassClue';
export const BLINK_CHEAT_ID = 'blinkCheat';
export const ADDITION_FACTOR = 1;
export const SUBSTRACTION_FACTOR = -1;

// Les constantes des pop-ups
export const HEIGHT_POP_ADMIN = '640px';
export const TIME_SETTING_INPUT1 = 'Temps initial';
export const TIME_SETTING_INPUT2 = 'Temps de pénalité';
export const TIME_SETTING_INPUT3 = 'Temps gagné';
export const TIME_PLACEHOLDER_INPUT1 = 'Temps par défaut: 30s';
export const TIME_PLACEHOLDER_INPUT2 = 'Temps par défaut: 5s';
export const TIME_PLACEHOLDER_INPUT3 = 'Temps par défaut: 5s';
export const INPUT_TYPE = 'secondes';

// Informations sur les toiles comme position et le mode du crayon
export const ORIGINAL_CANVAS_INDEX = 0;
export const MODIFIED_CANVAS_INDEX = 1;
export const DRAW_BACKGROUND_MODE = 'destination-over';
