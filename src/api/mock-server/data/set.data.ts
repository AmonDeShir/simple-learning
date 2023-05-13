import { audio } from "./audio.data";

export const setData = {
  "id": "0102",
  "title": "Test set 1",
  "progress": {
    "learning": 2,
    "relearning": 0,
    "graduated": 0
  },
  "protected": false,
  "words": [
    {
      "id": "62654ed22b1dda1589570b7d",
      "word": "word 1",
      "meaning": "meaning 1",
      "audio": audio.word,
      "language": "English",
      "firstExample": {
        "progress": {
          "eFactor": 2.5,
          "interval": 0,
          "intervalBeforeLearning": 0,
          "phase": "learning"
        },
        "example": "He got struck by a car and is in hospital now.",
        "translation": "On został potrącony przez samochód i jest teraz w szpitalu.",
        "audio": audio.example1,
        "_id": "62654ed32b1dda1589570b7f"
      },
      "secondExample": {
        "progress": {
          "eFactor": 2.5,
          "interval": 0,
          "intervalBeforeLearning": 0,
          "phase": "learning"
        },
        "example": "I think we should buy a second car.",
        "translation": "Myślę, że powinniśmy kupić drugi samochód.",
        "audio": audio.example2,
        "_id": "62654ed32b1dda1589570b81"
      },
      "usedIn": []
    },
    {
      "id": "62654ed22b1dda1589570b7e",
      "word": "word 2",
      "meaning": "meaning 2",
      "audio": audio.word,
      "language": "English",
      "firstExample": {
        "progress": {
          "eFactor": 2.5,
          "interval": 0,
          "intervalBeforeLearning": 0,
          "phase": "learning"
        },
        "example": "We were trapped in the car for almost four hours",
        "translation": "Byliśmy uwięzieni w kabinie windy przez prawie cztery godziny.",
        "audio": audio.example1,
        "_id": "62654ed32b1dda1589570b80"
      },
      "secondExample": {
        "progress": {
          "eFactor": 2.5,
          "interval": 0,
          "intervalBeforeLearning": 0,
          "phase": "learning"
        },
        "example": "Only six people can enter a car.",
        "translation": "Tylko sześciu ludzi może wejść do kabiny windy.",
        "audio": audio.example2,
        "_id": "62654ed32b1dda1589570b83"
      },
      "usedIn": []
    }
  ]
}