// Loggin utilities

type LogLevel = 'info' | 'warning' | 'error';
type LogFunction = (logLevel: LogLevel, title: string, ...lines: string[]) => void;

// There are better ways to infer the parameters types but I'm not there yet...
type ScopedLogFunction = (title: string, ...lines: string[]) => void;

const COLOR_MAP: { [level in LogLevel]: string } = {
    info: '34',
    warning: '33',
    error: '31',
}

const defaultLog: LogFunction = (logLevel: LogLevel, title, ...lines) => {
    console.log(
        `  ${String.fromCharCode(0x1b)}[${COLOR_MAP[logLevel]};1m•${String.fromCharCode(0x1b)}[0m ${title}`,
        ...lines ?? [].map(
            (line) =>
                `\n  ${String.fromCharCode(0x1b)}[${COLOR_MAP[logLevel]};1m|${String.fromCharCode(0x1b)}[0m ${line}`,
        )
    )    
}

export const LOG: {
    [level in LogLevel]: ScopedLogFunction;
} = {
    info: (title, ...lines) => defaultLog("info", title, ...lines),
    warning: (title, ...lines) => defaultLog("warning", title, ...lines),
    error: (title, ...lines) => defaultLog("error", title, ...lines),
}
