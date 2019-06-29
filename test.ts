// tests go here; this will not be compiled when this package is used as a library
gamepad.init(Gamepadtype.joystick)
basic.forever(function () {
    if (gamepad.ButtonState(GamepadButton.Up)) led.plot(2, 0); else led.unplot(2, 0);
    if (gamepad.ButtonState(GamepadButton.Left)) led.plot(0, 2); else led.unplot(0, 2);
    if (gamepad.ButtonState(GamepadButton.Down)) led.plot(2, 4); else led.unplot(2, 4);
    if (gamepad.ButtonState(GamepadButton.Right)) led.plot(4, 2); else led.unplot(4, 2);
})
