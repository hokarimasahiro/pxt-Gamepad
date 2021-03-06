/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */
enum Gamepadtype {
    // % block="original gamepad"
    original = 0,
    // % block="joystick"
    joystick = 1
}
enum GamepadButton {
    //% block="Up"
    Up = 0,
    //% block="Left"
    Left = 1,
    //% block="Down"
    Down = 2,
    //% block="Right"
    Right = 3
}
enum GamepadEvents {
    //% block="pressed"
    Down = EventBusValue.MICROBIT_BUTTON_EVT_DOWN,
    //% block="released"
    Up = EventBusValue.MICROBIT_BUTTON_EVT_UP,
    //% block="click"
    Click = EventBusValue.MICROBIT_BUTTON_EVT_CLICK
}
enum GamepadJoystick {
    // % block="X"
    x = 0,
    // % block="Y"
    y = 1
}
//% weight=10 color=#0fbc11 icon="\uf11b" block="Gamepad"
namespace gamepad {
    let gpType: number   //0:origial, 1:joystick
    let pinAssign: number[]
    let initflag: number = 0
    let joystickStep = 128
    let joystickPlay = 10

    function pinInit(): void {
        if (gpType == Gamepadtype.joystick) {
            pinAssign = []
            pinAssign.push(DigitalPin.P13)
            pinAssign.push(DigitalPin.P12)
            pinAssign.push(DigitalPin.P15)
            pinAssign.push(DigitalPin.P14)
        } else {
            pinAssign = []
            pinAssign.push(DigitalPin.P13)
            pinAssign.push(DigitalPin.P15)
            pinAssign.push(DigitalPin.P8)
            pinAssign.push(DigitalPin.P12)
        }
        pins.setPull(pinAssign[0], PinPullMode.PullUp)
        pins.setPull(pinAssign[1], PinPullMode.PullUp)
        pins.setPull(pinAssign[2], PinPullMode.PullUp)
        pins.setPull(pinAssign[3], PinPullMode.PullUp)
        pins.setEvents(pinAssign[0], PinEventType.Touch)
        pins.setEvents(pinAssign[1], PinEventType.Touch)
        pins.setEvents(pinAssign[2], PinEventType.Touch)
        pins.setEvents(pinAssign[3], PinEventType.Touch)
        initflag = 1
    }
    /**
     * TODO: ゲームパッドのタイプを設定する
     * @param gtype タイプ。, eg: oroginal
     */
    //% blockId=init gamepad block="init type=|%btype|"
    export function init(gtype: Gamepadtype): void {
        gpType = gtype
        pinInit()
    }
    /**
     * TODO: ボタンの状態を通知する
     * @param Button ボタン。, eg: Down Allow
     */
    //% blockId=Gamepad_Button_Sence block="Button|%Button|Is Pressed"
    export function ButtonState(Button: GamepadButton): boolean {
        if (initflag == 0) pinInit()
        return (pins.digitalReadPin(pinAssign[Button >> 0]) == 0) ? true : false
    }
    /**
     * TODO: ボタンが押されたとき
     * @param Button ボタン。, eg: Down Allow
     * @param Event きっかけ。, eg: pressed
     * @param handler 処理。
     */
    //% blockId=Gamepad_create_event block="on Button|%Button|Is %Event"
    export function onEvent(Button: GamepadButton, Event: GamepadEvents, handler: Action) {
        if (initflag == 0) pinInit()
        control.onEvent(pinAssign[Button >> 0], Event >> 0, handler);
    }
    /**
     * TODO: ジョイスティックの位置を取り出す
     * @param axis 軸方向。, eg: x
     */
    //% blockId=Gamepad_get_joystick block="Get Joystick|%axis| travel"
    export function JoyStick(axis: GamepadJoystick): number {
        if (axis == GamepadJoystick.x) {
            let deg = pins.analogReadPin(AnalogPin.P1)
            if(Math.abs(deg - (1023 / 2)) < joystickPlay) return 0;
            else return (Math.trunc(deg - (1023 / 2))) >> 0;
        } else {
            let deg = pins.analogReadPin(AnalogPin.P2)
            if (Math.abs(deg - (1023 / 2)) < joystickPlay) return 0;
            else return (Math.trunc(deg - (1023 / 2))) >> 0;
        }
        return 0
    }
    /**
     * TODO: ジョイスティックの分解能を設定する
     * @param reso 分解能。, eg: 32
     */
    //% blockId=Gamepad_set_zero_limit block="Set resolution to |%reso|"
    export function setResolution(reso: number): void {
        joystickStep = (512 / reso) >> 0
    }
    /**
     * TODO: ジョイスティックの遊びを設定する
     * @param play 遊び。, eg: 10
     */
    //% blockId=Gamepad_set_play block="Set play to |%play|"
    export function setPlay(play: number): void {
        joystickPlay = play >> 0
    }
    /**
     * TODO: ジョイスティックが動いたとき
     * @param axis 軸方向。, eg: x
     * @param handler 処理。
     */
    //% blockId=Gamepad_create_event block="on Joystick Move on |%axis| axis"
    export function onJoystick(axis: GamepadJoystick, handler: Action) {
        let JoystickEventId = 0x4100
        let lastJoystickX: number = JoyStick(GamepadJoystick.x)
        let lastJoystickY: number = JoyStick(GamepadJoystick.y)
        control.onEvent(JoystickEventId, axis, handler);
        if (initflag == 0) {
            pinInit();
            control.inBackground(() => {
                while (true) {
                    const JoystickX = JoyStick(GamepadJoystick.x)
                    if (JoystickX != lastJoystickX) {
                        lastJoystickX = JoystickX;
                        control.raiseEvent(JoystickEventId, GamepadJoystick.x);
                    }
                    const JoystickY = JoyStick(GamepadJoystick.y)
                    if (JoystickY != lastJoystickY) {
                        lastJoystickY = JoystickY;
                        control.raiseEvent(JoystickEventId, GamepadJoystick.y);
                    }
                    basic.pause(50);
                }
            })
        }
    }
}
