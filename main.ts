/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */

//% weight=100 color=#0fbc11 icon=""
enum GamepadButton {
    Down = DigitalPin.P8,
    Right = DigitalPin.P12,
    Up = DigitalPin.P13,
    Left = DigitalPin.P15
}
namespace Gamepad {
    let initflag: number = 0
    function init(): void {
        pins.setPull(DigitalPin.P8, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P12, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P13, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P15, PinPullMode.PullUp)
        initflag = 1
    }
    /**
     * TODO: ボタンの状態を通知する
     * @param Button ボタン。, eg: Down
     */
    //% blockId=Gamepad_Button_Sence block="Button Is Pressed|%Button"
    export function ButtonIsPressed(Button: GamepadButton): boolean {
        if (initflag == 0) init()

        switch (Button) {
            case GamepadButton.Down:
                return (pins.digitalReadPin(DigitalPin.P8) == 1) ? false : true
                break
            case GamepadButton.Right:
                return (pins.digitalReadPin(DigitalPin.P12) == 1) ? false : true
                break
            case GamepadButton.Up:
                return (pins.digitalReadPin(DigitalPin.P13) == 1) ? false : true
                break
            case GamepadButton.Left:
                return (pins.digitalReadPin(DigitalPin.P15) == 1) ? false : true
                break
        }
        return false
    }
    /**
     * TODO: ボタンが押されたとき
     * @param Button ボタン。, eg: Down
     * @param handler 処理。
     */
    //% blockId=Gamepad_create_event block="on Button Pressed|%Button"
    export function onButtonPressed(Button: GamepadButton, handler: Action) {
        let GamepadID = 0x4100
        let P8: number, P12: number, P13: number, P15: number
        let lP8: number, lP12: number, lP13: number, lP15: number

        lP8 = pins.digitalReadPin(DigitalPin.P8)
        lP12 = pins.digitalReadPin(DigitalPin.P12)
        lP13 = pins.digitalReadPin(DigitalPin.P13)
        lP15 = pins.digitalReadPin(DigitalPin.P15)

        control.onEvent(GamepadID, Button, handler);
        if (initflag == 0) {
            init()
            control.inBackground(() => {
                while (true) {
                    P8 = pins.digitalReadPin(DigitalPin.P8)
                    P12 = pins.digitalReadPin(DigitalPin.P12)
                    P13 = pins.digitalReadPin(DigitalPin.P13)
                    P15 = pins.digitalReadPin(DigitalPin.P15)

                    if (lP8 == 1 && P8 == 0) {
                        control.raiseEvent(GamepadID, GamepadButton.Down);
                    }
                    if (lP12 == 1 && P12 == 0) {
                        control.raiseEvent(GamepadID, GamepadButton.Right);
                    }
                    if (lP13 == 1 && P13 == 0) {
                        control.raiseEvent(GamepadID, GamepadButton.Up);
                    }
                    if (lP15 == 1 && P15 == 0) {
                        control.raiseEvent(GamepadID, GamepadButton.Left);
                    }
                    lP8 = P8
                    lP12 = P12
                    lP13 = P13
                    lP15 = P15
                    basic.pause(50);
                }
            })
        }
    }
}
