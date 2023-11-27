import { useRef } from "react";

const useTheme = () => {
    const availableThemes = {
        plain: 'plain',
        colorful: 'colorful'
    };

    const theme = useRef(availableThemes.plain);

    const setCurrentTheme = (t) => theme.current = t;

    const handler = {
        [availableThemes.plain]: (canvas, canvasContext, amplitudeArray) => {
            // Draw the amplitude inside the canvas
            for (let i = 0; i < amplitudeArray.length; i++) {
                const value = amplitudeArray[i] / 256;
                const y = canvas.current.height - canvas.current.height * value;
                canvasContext.fillStyle = "white";
                canvasContext.fillRect(i * 2, y, 2, 2);
            }
        },
        [availableThemes.colorful]: (canvas, canvasContext, amplitudeArray) => {
            // Draw the amplitude inside the canvas
            for (let i = 0; i < amplitudeArray.length; i++) {
                const colors = ['red', 'green', 'blue', 'yellow'];
                const value = amplitudeArray[i] / 256;
                canvasContext.fillStyle = colors[(i / 4) % 4];
                canvasContext.fillRect(i * 2, canvas.current.height * value, 2, 256 - canvas.current.height * value);
            }
        },
    }

    const visualize = (canvas, amplitudeArray) => {
        // Draw the amplitude inside the canvas
        const canvasContext = canvas.current.getContext("2d");

        // Clear the canvas
        canvasContext.clearRect(
            0,
            0,
            canvas.current.width,
            canvas.current.height
        );
        handler[theme.current](canvas, canvasContext, amplitudeArray);
    }

    return {
        visualize,
        setCurrentTheme,
        availableThemes,
        currentTheme: theme.current
    }
}

export default useTheme;