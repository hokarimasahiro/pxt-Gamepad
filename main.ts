/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */

//% weight=100 color=#0fbc11 icon=""
enum GamepadButton {
    //% block="Down"
    P8 = <number>DAL.MICROBIT_ID_IO_P8,
    //% block="Right"
    P12 = <number>DAL.MICROBIT_ID_IO_P12,
    //% block="Up"
    P13 = <number>DAL.MICROBIT_ID_IO_P13,
    //% block="Left"
    P15 = <number>DAL.MICROBIT_ID_IO_P15
}
enum GamepadEvents {
    //% block="pressed"
    Down = DAL.MICROBIT_BUTTON_EVT_DOWN,
    //% block="released"
    Up = DAL.MICROBIT_BUTTON_EVT_UP
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
     * @param Button ボタン。, eg: Down Allow
     */
    //% blockId=Gamepad_Button_Sence block="Button|%Button|Is Pressed"
    export function ButtonState(Button: GamepadButton): boolean {
        if (initflag == 0) init()
        return (pins.digitalReadPin(<number>Button) == 0) ? true : false
    }
    /**
     * TODO: ボタンが押されたとき
     * @param Button ボタン。, eg: Down Allow
     * @param Event きっかけ。, eg: pressed
     * @param handler 処理。
     */
    //% blockId=Gamepad_create_event block="on Button|%Button|Is %Event"
    export function onEvent(Button: GamepadButton,Event:GamepadEvents, handler: Action) {
        if (initflag == 0) init()
        control.onEvent(<number>Button,<number>Event, handler);
    }
}
