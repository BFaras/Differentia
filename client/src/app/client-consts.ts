// Constantes du game Form components
export const ADMIN_GAME_FORMS_BUTTON = ['Supprimer', 'Réinitialiser'];
export const SELECTION_GAME_FORMS_BUTTON = ['Créer', 'Jouer', 'Joindre'];
export const MULTIPLAYER_MODE = true;
export const SOMEBODY_IS_WAITING = true;
export const CREATE_FLAG = true;
export const JOIN_FLAG = true;

//Contantes de temps de jeu par défault
export const DEFAULT_INITIAL_TIME = 30;
export const DEFAULT_PENALTY_TIME = 5;
export const DEFAULT_SAVED_TIME = 5;
export const INITIAL_TIME_INDEX = 0;
export const PENALTY_TIME_INDEX = 1;
export const SAVED_TIME_INDEX = 2;

export const MINIMUM_INITIAL_TIME = 15;
export const MINIMUM_PENALTY_TIME = 2;
export const MINIMUM_SAVED_TIME = 2;

export const MAXIMUM_INITIAL_TIME = 160;
export const MAXIMUM_PENALTY_TIME = 40;
export const MAXIMUM_SAVED_TIME = 40;
export const TIME_RATIO = 4;

export const EMPTY_TIME = '';
export const MSG_PENALTY_TIME_RATIO = 'Le temps de pénalité ne doit pas dépasser le quart du temps initial';
export const MSG_SAVED_TIME_RATIO = 'Le temps gagné ne doit pas  dépasser le quart du temps initial';
export const MSG_ALL_TIME_RATIO = 'Le temps de pénalité et le temps gagné ne doivent pas dépasser le quart du temps initial';

//Constantes vérification jeu avant upload
export const MINIMUM_NB_DIFFERENCES = 3;
export const MAXIMUM_NB_DIFFERENCES = 9;

// Constantes pour drawWord
export const STEP = 20;

// Constantes concernant les dimension des pop-up
export const STANDARD_POP_UP_HEIGHT = '400px';
export const STANDARD_POP_UP_WIDTH = '600px';
export const DISABLE_CLOSE = true;
export const CLASSIC_FLAG = true;

// Constantes des noms de la page principale
export const MAIN_PAGE_BUTTONS = ['Mode classique', 'Temps limité', 'Administration'];

// Constantes pour les bouttons des pop-up
export const DISABLE_BUTTON = true;

// Constantes pour la validation du username
export const USERNAME_VALID = true;

// Constantes pour le pop-up de temps limité
export const EMPTY_GAME_NAME = '';

// Constantes pour le pop-up d'attente de joueur
export const SOMEONE_IS_JOINING = true;
export const EMPTY_PLAYER_NAME = '';

// Username pop-up constants
export const MULTI_FLAG = true;

// Constante pour le service de chat
export const GAME_MESSAGE_SENDER_NAME = 'Game';
export const MESSAGE_ERROR_DIFFERENCE_SOLO = 'Erreur, aucune nouvelle différence trouvée!';
export const MESSAGE_DIFFERENCE_FOUND_SOLO = 'Vous avez trouver une différence!';
export const MESSAGE_DIFFERENCE_FOUND_MULTI = 'Différence trouvée par ';
export const MESSAGE_ERROR_DIFFERENCE_MULTI = 'Erreur par ';
export const TWO_DIGIT_TIME_VALUE = '2-digit';

// End game messages
export const CLASSIC_SOLO_END_GAME_MESSAGE = 'Vous avez trouvé toutes les différences!';
export const CLASSIC_MULTIPLAYER_REAL_WIN_MESSAGE = 'Vous avez gagnez contre votre adversaire!';
export const CLASSIC_MULTIPLAYER_ABANDON_WIN_MESSAGE = 'Votre adversaire a abandonné, donc vous avez gagner!';
export const CLASSIC_MULTIPLAYER_LOST_MESSAGE = 'Vous avez perdu contre votre adversaire :(';
export const ABANDON_MESSAGE = ' a abandonné la partie';
export const WIN_FLAG = true;
export const LOSING_FLAG = false;
export const TIMER_HIT_ZERO_MESSAGE = 'Le temps est arrivé à zéro, vous avez perdu...';
export const ALL_GAMES_FINISHED = 'Vous avez fini tous les jeux disponibles! Vous avez gagné!';

// Timeout constantes
export const THREE_SECONDS = 3000;

// Blinking constants
export const BLINK_ID = 'blink';
export const PAUSED_ID = 'paused';

// Time service constants
export const BASE_ONE = 10;
export const EMPTY_SHOWABLE_TIME = '';
//Constantes pour ListGameForms
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
export const RESET_INFO_GAME_LIST = 'Liste des jeux';
