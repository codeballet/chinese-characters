# Chinese Characters Web App

Web app for finding, learning, and practicing Chinese characters

## Data structure

```
[
    {
        id: number,
        character: string,
        english: array,
        pinyin: array,
        tone: array,
        composites: {
            id: number,
            character: string,
            english: array,
            pinyin: array,
            tone: array,
        }
    }
]
```
