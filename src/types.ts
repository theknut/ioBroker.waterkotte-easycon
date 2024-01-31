interface Path {
    Id: string;
}

export class CommonState implements Path {
    private static readonly ID_PARTS_REGEXP = /(?<qualifier>[a-z])(?<number>\d+)/gim;
    readonly type: string = 'CommonState';
    readonly Path: string;
    readonly Id: string;
    readonly Readonly: boolean;
    readonly Unit: string | undefined;
    readonly Text: ioBroker.StringOrTranslated;
    readonly Type: ioBroker.CommonType;
    readonly ValueMap: Record<number, ioBroker.StringOrTranslated>;

    constructor(
        path: string,
        id: string,
        text: ioBroker.StringOrTranslated,
        unit?: string,
        readonly: boolean = true,
        valueMap: Record<number, ioBroker.StringOrTranslated> = [],
        type: ioBroker.CommonType = 'number',
    ) {
        this.Path = path;
        this.Id = id;
        this.Text = text;
        this.Unit = unit;
        this.Readonly = readonly;
        this.ValueMap = valueMap;
        this.Type = type;
    }

    static getIdParts(id: string): { Qualifier: string; Number: number } {
        const groups = id.matchAll(CommonState.ID_PARTS_REGEXP)?.next()?.value?.groups;
        if (!groups) {
            throw new AdapterError(`Tag id ${id} format not supported`);
        }

        return { Qualifier: groups.qualifier, Number: Number(groups.number) };
    }

    getStateId(): string {
        return `${this.Path}.${this.Id}`;
    }

    getRole(): string {
        if (this.Unit === '°C') {
            return 'value.temperature';
        } else if (this.Type === 'boolean') {
            return 'indicator';
        } else {
            return 'value';
        }
    }

    getCommonObject(): ioBroker.StateCommon {
        const common = <ioBroker.StateCommon>{
            name: this.Text,
            unit: this.Unit,
            type: this.Type,
            read: true,
            role: this.getRole(),
            write: !this.Readonly,
            states: this.ValueMap,
        };
        return common;
    }

    normalizeValue(value: number): any {
        switch (this.Id[0]) {
            case 'D':
                return this.toBoolean(value);
            case 'A':
                if (this.Unit === 'kWh' || this instanceof HexAnalogState) {
                    throw new AdapterError(
                        'Cannot normalize hex value based on a single value. Use this.normalizeHexValue(any, any) instead.',
                    );
                }
                return Number(value) / 10;
            case 'I':
                if (this.Type === 'boolean') {
                    return this.toBoolean(value);
                } else {
                    return Number(value);
                }
            default:
                throw new AdapterError(`Type ${this.Type} not implemented`);
        }
    }

    private toBoolean(value: any): boolean {
        if (value > 1) {
            throw new AdapterError(`Received invalid value '${value}' for id '${this.Id}'`);
        }
        return value === 1;
    }
}

export class HexAnalogState extends CommonState {
    readonly type: string = 'HexAnalogState';
    constructor(
        path: string,
        public idPrimary: string,
        public idSecondary: string,
        text: ioBroker.StringOrTranslated,
    ) {
        if (
            CommonState.getIdParts(idPrimary).Qualifier !== 'A' ||
            CommonState.getIdParts(idSecondary).Qualifier !== 'A'
        ) {
            throw new AdapterError(`Only analog values can be hex (${idPrimary}, ${idSecondary})`);
        }
        super(path, idPrimary, text, 'kWh', true, [], 'number');
    }

    normalizeHexValue(firstValue: number, secondaryValue: number): any {
        if (!firstValue || !secondaryValue) {
            throw new AdapterError(
                `None or only one value was provided, but two are needed to normalize hex value (firstValue: ${firstValue}, secondaryValue: ${secondaryValue})`,
            );
        }

        const value = ((firstValue << 16) >>> 0) | ((secondaryValue >>> 0) & 65535);
        return Number(this.IEEE754_Hex32ToDez(value, 1));
    }

    private IEEE754_Hex32ToDez(param1: any, t: any) {
        const a = param1.toString(16);
        var e,
            i,
            n,
            l,
            o,
            r,
            s,
            d,
            g,
            x = '00000000';
        return (
            (i = x + parseInt(a.substr(0, 2), 16).toString(2)),
            (n = x + parseInt(a.substr(2, 2), 16).toString(2)),
            (l = x + parseInt(a.substr(4, 2), 16).toString(2)),
            (o = x + parseInt(a.substr(6, 2), 16).toString(2)),
            (i = i.substr(i.length - 8, 8)),
            (n = n.substr(n.length - 8, 8)),
            (l = l.substr(l.length - 8, 8)),
            (o = o.substr(o.length - 8, 8)),
            (r = i + n + l + o),
            (s = parseInt(r.charAt(0), 2)),
            (d = parseInt(r.substr(1, 8), 2)),
            (g = parseInt(r.substr(9, 23), 2)),
            (e = (1 - 2 * s) * Math.pow(2, d - 127) * (1 + g / Math.pow(2, 23))),
            e.toFixed(t)
        );
    }
}

export class ReadOnlyState extends CommonState {
    readonly type: string = 'ReadOnlyState';
    constructor(
        path: string,
        id: string,
        text: ioBroker.StringOrTranslated,
        unit?: string,
        type: ioBroker.CommonType = 'number',
    ) {
        super(path, id, text, unit, true, [], type);
    }
}

export class State extends CommonState {
    readonly type: string = 'State';
    constructor(
        path: string,
        id: string,
        text: ioBroker.StringOrTranslated,
        unit?: string,
        type: ioBroker.CommonType = 'number',
    ) {
        super(path, id, text, unit, false, [], type);
    }
}

export class EnumState extends CommonState {
    readonly type: string = 'EnumState';
    constructor(
        path: string,
        id: string,
        text: ioBroker.StringOrTranslated,
        valueMap: Record<number, ioBroker.StringOrTranslated>,
        unit?: string,
    ) {
        super(path, id, text, unit, false, valueMap, 'number');
    }
}

export class ReadOnlyEnumState extends CommonState {
    readonly type: string = 'ReadOnlyEnumState';
    constructor(
        path: string,
        id: string,
        text: ioBroker.StringOrTranslated,
        valueMap: Record<number, ioBroker.StringOrTranslated>,
        unit?: string,
    ) {
        super(path, id, text, unit, true, valueMap, 'number');
    }
}

export class IndicatorState extends ReadOnlyState {
    readonly type: string = 'Indicator';
    constructor(path: string, id: string, text: ioBroker.StringOrTranslated) {
        super(path, id, text, undefined, 'boolean');
    }
}

export type Login = {
    readonly token: string;
};

export type TagResponseRecord = {
    readonly name: string;
    readonly status: string;
    readonly value: any;
    readonly unkown: string;
};

export class TagResponse {
    static STATUS_OK = 'S_OK';
    constructor(
        public readonly response: TagResponseRecord,
        public readonly state: CommonState,
    ) {}
}

export class UnknownTagResponse extends TagResponse {
    constructor(response: TagResponseRecord, state: CommonState) {
        super(response, state);
    }
}

export interface ILogProvider {
    debug(message: string | unknown): void;
    warn(message: string | unknown): void;
    error(message: string | unknown): void;
}

export class WaterkotteError extends Error {
    static TOO_MANY_USERS = -37;
    static USER_DOES_NOT_EXIST = -49;
    static PASS_DONT_MATCH = -45;
    constructor(
        public code: number,
        message: string,
    ) {
        super(message);
    }
}

export class AdapterError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class RethrowError extends AdapterError {
    constructor(innerError: Error, message: string = innerError.message) {
        super(message);
    }
}
