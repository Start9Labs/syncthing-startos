// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function saferStringify(x) {
    try {
        return JSON.stringify(x);
    } catch (e) {
        return "" + x;
    }
}
class AnyParser {
    constructor(description = {
        name: "Any",
        children: [],
        extras: []
    }){
        this.description = description;
    }
    parse(a, onParse) {
        return onParse.parsed(a);
    }
    description;
}
class ArrayParser {
    constructor(description = {
        name: "Array",
        children: [],
        extras: []
    }){
        this.description = description;
    }
    parse(a, onParse) {
        if (Array.isArray(a)) return onParse.parsed(a);
        return onParse.invalid({
            value: a,
            keys: [],
            parser: this
        });
    }
    description;
}
class BoolParser {
    constructor(description = {
        name: "Boolean",
        children: [],
        extras: []
    }){
        this.description = description;
    }
    parse(a, onParse) {
        if (a === true || a === false) return onParse.parsed(a);
        return onParse.invalid({
            value: a,
            keys: [],
            parser: this
        });
    }
    description;
}
const isObject = (x)=>typeof x === "object" && x != null
;
const isFunctionTest = (x)=>typeof x === "function"
;
const isNumber = (x)=>typeof x === "number"
;
const isString = (x)=>typeof x === "string"
;
const booleanOnParse = {
    parsed (_) {
        return true;
    },
    invalid (_) {
        return false;
    }
};
class FunctionParser {
    constructor(description = {
        name: "Function",
        children: [],
        extras: []
    }){
        this.description = description;
    }
    parse(a, onParse) {
        if (isFunctionTest(a)) return onParse.parsed(a);
        return onParse.invalid({
            value: a,
            keys: [],
            parser: this
        });
    }
    description;
}
class NilParser {
    constructor(description = {
        name: "Null",
        children: [],
        extras: []
    }){
        this.description = description;
    }
    parse(a, onParse) {
        if (a === null || a === undefined) return onParse.parsed(a);
        return onParse.invalid({
            value: a,
            keys: [],
            parser: this
        });
    }
    description;
}
class ObjectParser {
    constructor(description = {
        name: "Object",
        children: [],
        extras: []
    }){
        this.description = description;
    }
    parse(a, onParse) {
        if (isObject(a)) return onParse.parsed(a);
        return onParse.invalid({
            value: a,
            keys: [],
            parser: this
        });
    }
    description;
}
class StringParser {
    constructor(description = {
        name: "String",
        children: [],
        extras: []
    }){
        this.description = description;
    }
    parse(a, onParse) {
        if (isString(a)) return onParse.parsed(a);
        return onParse.invalid({
            value: a,
            keys: [],
            parser: this
        });
    }
    description;
}
class UnknownParser {
    constructor(description = {
        name: "Unknown",
        children: [],
        extras: []
    }){
        this.description = description;
    }
    parse(a, onParse) {
        return onParse.parsed(a);
    }
    description;
}
class ConcatParsers {
    constructor(parent, otherParser, description = {
        name: "Concat",
        children: [
            parent,
            otherParser
        ],
        extras: []
    }){
        this.parent = parent;
        this.otherParser = otherParser;
        this.description = description;
    }
    static of(parent, otherParser) {
        if (parent.unwrappedParser().description.name === "Any") {
            return otherParser;
        }
        if (otherParser.unwrappedParser().description.name === "Any") {
            return parent;
        }
        return new ConcatParsers(parent, otherParser);
    }
    parse(a, onParse) {
        const parent = this.parent.enumParsed(a);
        if ("error" in parent) {
            return onParse.invalid(parent.error);
        }
        const other = this.otherParser.enumParsed(parent.value);
        if ("error" in other) {
            return onParse.invalid(other.error);
        }
        return onParse.parsed(other.value);
    }
    parent;
    otherParser;
    description;
}
class DefaultParser {
    constructor(parent, defaultValue, description = {
        name: "Default",
        children: [
            parent
        ],
        extras: [
            defaultValue
        ]
    }){
        this.parent = parent;
        this.defaultValue = defaultValue;
        this.description = description;
    }
    parse(a, onParse) {
        const parser = this;
        const defaultValue = this.defaultValue;
        if (a == null) {
            return onParse.parsed(defaultValue);
        }
        const parentCheck = this.parent.enumParsed(a);
        if ("error" in parentCheck) {
            parentCheck.error.parser = parser;
            return onParse.invalid(parentCheck.error);
        }
        return onParse.parsed(parentCheck.value);
    }
    parent;
    defaultValue;
    description;
}
class GuardParser {
    constructor(checkIsA, typeName, description = {
        name: "Guard",
        children: [],
        extras: [
            typeName
        ]
    }){
        this.checkIsA = checkIsA;
        this.typeName = typeName;
        this.description = description;
    }
    parse(a, onParse) {
        if (this.checkIsA(a)) {
            return onParse.parsed(a);
        }
        return onParse.invalid({
            value: a,
            keys: [],
            parser: this
        });
    }
    checkIsA;
    typeName;
    description;
}
class MappedAParser {
    constructor(parent, map, mappingName = map.name, description = {
        name: "Mapped",
        children: [
            parent
        ],
        extras: [
            mappingName
        ]
    }){
        this.parent = parent;
        this.map = map;
        this.mappingName = mappingName;
        this.description = description;
    }
    parse(a, onParse) {
        const map = this.map;
        const result = this.parent.enumParsed(a);
        if ("error" in result) {
            return onParse.invalid(result.error);
        }
        return onParse.parsed(map(result.value));
    }
    parent;
    map;
    mappingName;
    description;
}
class MaybeParser {
    constructor(parent, description = {
        name: "Maybe",
        children: [
            parent
        ],
        extras: []
    }){
        this.parent = parent;
        this.description = description;
    }
    parse(a, onParse) {
        if (a == null) {
            return onParse.parsed(null);
        }
        const parser = this;
        const parentState = this.parent.enumParsed(a);
        if ("error" in parentState) {
            const { error  } = parentState;
            error.parser = parser;
            return onParse.invalid(error);
        }
        return onParse.parsed(parentState.value);
    }
    parent;
    description;
}
class OrParsers {
    constructor(parent, otherParser, description = {
        name: "Or",
        children: [
            parent,
            otherParser
        ],
        extras: []
    }){
        this.parent = parent;
        this.otherParser = otherParser;
        this.description = description;
    }
    parse(a, onParse) {
        const parser = this;
        const parent = this.parent.enumParsed(a);
        if ("value" in parent) {
            return onParse.parsed(parent.value);
        }
        const other = this.otherParser.enumParsed(a);
        if ("error" in other) {
            const { error  } = other;
            error.parser = parser;
            return onParse.invalid(error);
        }
        return onParse.parsed(other.value);
    }
    parent;
    otherParser;
    description;
}
class NumberParser {
    constructor(description = {
        name: "Number",
        children: [],
        extras: []
    }){
        this.description = description;
    }
    parse(a, onParse) {
        if (isNumber(a)) return onParse.parsed(a);
        return onParse.invalid({
            value: a,
            keys: [],
            parser: this
        });
    }
    description;
}
function unwrapParser(a) {
    if (a instanceof Parser) return unwrapParser(a.parser);
    return a;
}
const enumParsed = {
    parsed (value) {
        return {
            value
        };
    },
    invalid (error) {
        return {
            error
        };
    }
};
class Parser {
    _TYPE;
    constructor(parser, description = {
        name: "Wrapper",
        children: [
            parser
        ],
        extras: []
    }){
        this.parser = parser;
        this.description = description;
        this._TYPE = null;
        this.test = (value)=>{
            return this.parse(value, booleanOnParse);
        };
    }
    parse(a, onParse) {
        return this.parser.parse(a, onParse);
    }
    static isA(checkIsA, name) {
        return new Parser(new GuardParser(checkIsA, name));
    }
    static validatorErrorAsString = (error)=>{
        const { parser , value , keys  } = error;
        const keysString = !keys.length ? "" : keys.map((x)=>`[${x}]`
        ).reverse().join("");
        return `${keysString}${Parser.parserAsString(parser)}(${saferStringify(value)})`;
    };
    static parserAsString(parserComingIn) {
        const parser = unwrapParser(parserComingIn);
        const { description: { name , extras , children  } ,  } = parser;
        if (parser instanceof ShapeParser) {
            return `${name}<{${parser.description.children.map((subParser, i)=>`${String(parser.description.extras[i]) || "?"}:${Parser.parserAsString(subParser)}`
            ).join(",")}}>`;
        }
        if (parser instanceof OrParsers) {
            const parent = unwrapParser(parser.parent);
            const parentString = Parser.parserAsString(parent);
            if (parent instanceof OrParsers) return parentString;
            return `${name}<${parentString},...>`;
        }
        if (parser instanceof GuardParser) {
            return String(extras[0] || name);
        }
        if (parser instanceof StringParser || parser instanceof ObjectParser || parser instanceof NumberParser || parser instanceof BoolParser || parser instanceof AnyParser) {
            return name.toLowerCase();
        }
        if (parser instanceof FunctionParser) {
            return name;
        }
        if (parser instanceof NilParser) {
            return "null";
        }
        if (parser instanceof ArrayParser) {
            return "Array<unknown>";
        }
        const specifiers = [
            ...extras.map(saferStringify),
            ...children.map(Parser.parserAsString), 
        ];
        const specifiersString = `<${specifiers.join(",")}>`;
        !children.length ? "" : `<>`;
        return `${name}${specifiersString}`;
    }
    unsafeCast(value) {
        const state = this.enumParsed(value);
        if ("value" in state) return state.value;
        const { error  } = state;
        throw new TypeError(`Failed type: ${Parser.validatorErrorAsString(error)} given input ${saferStringify(value)}`);
    }
    castPromise(value) {
        const state = this.enumParsed(value);
        if ("value" in state) return Promise.resolve(state.value);
        const { error  } = state;
        return Promise.reject(new TypeError(`Failed type: ${Parser.validatorErrorAsString(error)} given input ${saferStringify(value)}`));
    }
    map(fn, mappingName) {
        return new Parser(new MappedAParser(this, fn, mappingName));
    }
    concat(otherParser) {
        return new Parser(ConcatParsers.of(this, new Parser(otherParser)));
    }
    orParser(otherParser) {
        return new Parser(new OrParsers(this, new Parser(otherParser)));
    }
    test;
    optional(name) {
        return new Parser(new MaybeParser(this));
    }
    defaultTo(defaultValue) {
        return new Parser(new DefaultParser(new Parser(new MaybeParser(this)), defaultValue));
    }
    validate(isValid, otherName) {
        return new Parser(ConcatParsers.of(this, new Parser(new GuardParser(isValid, otherName))));
    }
    refine(refinementTest, otherName = refinementTest.name) {
        return new Parser(ConcatParsers.of(this, new Parser(new GuardParser(refinementTest, otherName))));
    }
    name(nameString) {
        return parserName(nameString, this);
    }
    enumParsed(value) {
        return this.parse(value, enumParsed);
    }
    unwrappedParser() {
        let answer = this;
        while(true){
            const next = answer.parser;
            if (next instanceof Parser) {
                answer = next;
            } else {
                return next;
            }
        }
    }
    parser;
    description;
}
function guard(test, testName) {
    return Parser.isA(test, testName || test.name);
}
const any = new Parser(new AnyParser());
class ArrayOfParser {
    constructor(parser, description = {
        name: "ArrayOf",
        children: [
            parser
        ],
        extras: []
    }){
        this.parser = parser;
        this.description = description;
    }
    parse(a, onParse) {
        if (!Array.isArray(a)) {
            return onParse.invalid({
                value: a,
                keys: [],
                parser: this
            });
        }
        const values = [
            ...a
        ];
        for(let index = 0; index < values.length; index++){
            const result = this.parser.enumParsed(values[index]);
            if ("error" in result) {
                result.error.keys.push("" + index);
                return onParse.invalid(result.error);
            } else {
                values[index] = result.value;
            }
        }
        return onParse.parsed(values);
    }
    parser;
    description;
}
function arrayOf(validator) {
    return new Parser(new ArrayOfParser(validator));
}
const unknown = new Parser(new UnknownParser());
const number = new Parser(new NumberParser());
const isNill = new Parser(new NilParser());
const natural = number.refine((x)=>x >= 0 && x === Math.floor(x)
);
const isFunction = new Parser(new FunctionParser());
const __boolean = new Parser(new BoolParser());
class DeferredParser {
    parser;
    static create() {
        return new DeferredParser();
    }
    constructor(description = {
        name: "Deferred",
        children: [],
        extras: []
    }){
        this.description = description;
    }
    setParser(parser) {
        this.parser = new Parser(parser);
        return this;
    }
    parse(a, onParse) {
        if (!this.parser) {
            return onParse.invalid({
                value: "Not Set Up",
                keys: [],
                parser: this
            });
        }
        return this.parser.parse(a, onParse);
    }
    description;
}
function deferred() {
    const deferred1 = DeferredParser.create();
    function setParser(parser) {
        deferred1.setParser(parser);
    }
    return [
        new Parser(deferred1),
        setParser
    ];
}
const object = new Parser(new ObjectParser());
class DictionaryParser {
    constructor(parsers, description = {
        name: "Dictionary",
        children: parsers.reduce((acc, [k, v])=>{
            acc.push(k, v);
            return acc;
        }, []),
        extras: []
    }){
        this.parsers = parsers;
        this.description = description;
    }
    parse(a, onParse) {
        const { parsers  } = this;
        const parser = this;
        const answer = {
            ...a
        };
        outer: for(const key in a){
            let parseError = [];
            for (const [keyParser, valueParser] of parsers){
                const enumState = keyParser.enumParsed(key);
                if ("error" in enumState) {
                    const { error  } = enumState;
                    error.parser = parser;
                    error.keys.push("" + key);
                    parseError.push(error);
                    continue;
                }
                const newKey = enumState.value;
                const valueState = valueParser.enumParsed(a[key]);
                if ("error" in valueState) {
                    const { error  } = valueState;
                    error.keys.push("" + newKey);
                    parseError.unshift(error);
                    continue;
                }
                delete answer[key];
                answer[newKey] = valueState.value;
                break outer;
            }
            const error = parseError[0];
            if (!!error) {
                return onParse.invalid(error);
            }
        }
        return onParse.parsed(answer);
    }
    parsers;
    description;
}
const dictionary = (...parsers)=>{
    return object.concat(new DictionaryParser([
        ...parsers
    ]));
};
function every(...parsers) {
    const filteredParsers = parsers.filter((x)=>x !== any
    );
    if (filteredParsers.length <= 0) {
        return any;
    }
    const first = filteredParsers.splice(0, 1)[0];
    return filteredParsers.reduce((left, right)=>{
        return left.concat(right);
    }, first);
}
const isArray = new Parser(new ArrayParser());
const string = new Parser(new StringParser());
const instanceOf = (classCreator)=>guard((x)=>x instanceof classCreator
    , `is${classCreator.name}`)
;
class LiteralsParser {
    constructor(values, description = {
        name: "Literal",
        children: [],
        extras: values
    }){
        this.values = values;
        this.description = description;
    }
    parse(a, onParse) {
        if (this.values.indexOf(a) >= 0) {
            return onParse.parsed(a);
        }
        return onParse.invalid({
            value: a,
            keys: [],
            parser: this
        });
    }
    values;
    description;
}
function literal(isEqualToValue) {
    return new Parser(new LiteralsParser([
        isEqualToValue
    ]));
}
function literals(firstValue, ...restValues) {
    return new Parser(new LiteralsParser([
        firstValue,
        ...restValues
    ]));
}
class ShapeParser {
    constructor(parserMap, isPartial1, parserKeys = Object.keys(parserMap), description = {
        name: isPartial1 ? "Partial" : "Shape",
        children: parserKeys.map((key)=>parserMap[key]
        ),
        extras: parserKeys
    }){
        this.parserMap = parserMap;
        this.isPartial = isPartial1;
        this.parserKeys = parserKeys;
        this.description = description;
    }
    parse(a, onParse) {
        const parser = this;
        if (!object.test(a)) {
            return onParse.invalid({
                value: a,
                keys: [],
                parser
            });
        }
        const { parserMap , isPartial: isPartial2  } = this;
        const value = {
            ...a
        };
        if (Array.isArray(a)) {
            value.length = a.length;
        }
        for(const key in parserMap){
            if (key in value) {
                const parser = parserMap[key];
                const state = parser.enumParsed(a[key]);
                if ("error" in state) {
                    const { error  } = state;
                    error.keys.push(saferStringify(key));
                    return onParse.invalid(error);
                }
                const smallValue = state.value;
                value[key] = smallValue;
            } else if (!isPartial2) {
                return onParse.invalid({
                    value: "missingProperty",
                    parser,
                    keys: [
                        saferStringify(key)
                    ]
                });
            }
        }
        return onParse.parsed(value);
    }
    parserMap;
    isPartial;
    parserKeys;
    description;
}
const isPartial = (testShape)=>{
    return new Parser(new ShapeParser(testShape, true));
};
const partial = isPartial;
class RecursiveParser {
    parser;
    static create(fn) {
        const parser = new RecursiveParser(fn);
        parser.parser = fn(new Parser(parser));
        return parser;
    }
    constructor(recursive1, description = {
        name: "Recursive",
        children: [],
        extras: [
            recursive1
        ]
    }){
        this.recursive = recursive1;
        this.description = description;
    }
    parse(a, onParse) {
        if (!this.parser) {
            return onParse.invalid({
                value: "Recursive Invalid State",
                keys: [],
                parser: this
            });
        }
        return this.parser.parse(a, onParse);
    }
    recursive;
    description;
}
function recursive(fn) {
    fn(any);
    const created = RecursiveParser.create(fn);
    return new Parser(created);
}
const regex = (tester)=>string.refine(function(x) {
        return tester.test(x);
    }, tester.toString())
;
const isShape = (testShape)=>{
    return new Parser(new ShapeParser(testShape, false));
};
function shape(testShape, optionals, optionalAndDefaults) {
    if (optionals) {
        const defaults = optionalAndDefaults || {};
        console.log("test");
        const entries = Object.entries(testShape);
        const optionalSet = new Set(Array.from(optionals));
        return every(partial(Object.fromEntries(entries.filter(([key, _])=>optionalSet.has(key)
        ).map(([key, parser])=>[
                key,
                parser
            ]
        ))), isShape(Object.fromEntries(entries.filter(([key, _])=>!optionalSet.has(key)
        )))).map((ret)=>{
            for (const key of optionalSet){
                const keyAny = key;
                if (!(keyAny in ret) && keyAny in defaults) {
                    ret[keyAny] = defaults[keyAny];
                }
            }
            return ret;
        });
    }
    return isShape(testShape);
}
function some(...parsers) {
    if (parsers.length <= 0) {
        return any;
    }
    const first = parsers.splice(0, 1)[0];
    return parsers.reduce((left, right)=>left.orParser(right)
    , first);
}
class TupleParser {
    constructor(parsers, lengthMatcher = literal(parsers.length), description = {
        name: "Tuple",
        children: parsers,
        extras: []
    }){
        this.parsers = parsers;
        this.lengthMatcher = lengthMatcher;
        this.description = description;
    }
    parse(input, onParse) {
        const tupleError = isArray.enumParsed(input);
        if ("error" in tupleError) return onParse.invalid(tupleError.error);
        const values = input;
        const stateCheck = this.lengthMatcher.enumParsed(values.length);
        if ("error" in stateCheck) {
            stateCheck.error.keys.push(saferStringify("length"));
            return onParse.invalid(stateCheck.error);
        }
        const answer = new Array(this.parsers.length);
        for(const key in this.parsers){
            const parser = this.parsers[key];
            const value = values[key];
            const result = parser.enumParsed(value);
            if ("error" in result) {
                const { error  } = result;
                error.keys.push(saferStringify(key));
                return onParse.invalid(error);
            }
            answer[key] = result.value;
        }
        return onParse.parsed(answer);
    }
    parsers;
    lengthMatcher;
    description;
}
function tuple(...parsers) {
    return new Parser(new TupleParser(parsers));
}
class NamedParser {
    constructor(parent, name, description = {
        name: "Named",
        children: [
            parent
        ],
        extras: [
            name
        ]
    }){
        this.parent = parent;
        this.name = name;
        this.description = description;
    }
    parse(a, onParse) {
        const parser = this;
        const parent = this.parent.enumParsed(a);
        if ("error" in parent) {
            const { error  } = parent;
            error.parser = parser;
            return onParse.invalid(error);
        }
        return onParse.parsed(parent.value);
    }
    parent;
    name;
    description;
}
function parserName(name, parent) {
    return new Parser(new NamedParser(parent, name));
}
class Matched {
    constructor(value){
        this.value = value;
    }
    when(..._args) {
        return this;
    }
    defaultTo(_defaultValue) {
        return this.value;
    }
    defaultToLazy(_getValue) {
        return this.value;
    }
    unwrap() {
        return this.value;
    }
    value;
}
class MatchMore {
    constructor(a){
        this.a = a;
    }
    when(...args) {
        const [outcome, ...matchers] = args.reverse();
        const me = this;
        const parser = matches.some(...matchers.map((matcher)=>matcher instanceof Parser ? matcher : literal(matcher)
        ));
        const result = parser.enumParsed(this.a);
        if ("error" in result) {
            return me;
        }
        const { value  } = result;
        if (outcome instanceof Function) {
            return new Matched(outcome(value));
        }
        return new Matched(outcome);
    }
    defaultTo(value) {
        return value;
    }
    defaultToLazy(getValue) {
        return getValue();
    }
    unwrap() {
        throw new Error("Expecting that value is matched");
    }
    a;
}
const matches = Object.assign(function matchesFn(value) {
    return new MatchMore(value);
}, {
    array: isArray,
    arrayOf,
    some,
    tuple,
    regex,
    number,
    natural,
    isFunction,
    object,
    string,
    shape,
    partial,
    literal,
    every,
    guard,
    unknown,
    any,
    boolean: __boolean,
    dictionary,
    literals,
    nill: isNill,
    instanceOf,
    Parse: Parser,
    parserName,
    recursive,
    deferred
});
const { shape: shape1 , number: number1 , string: string1 , some: some1  } = matches;
const matchesStringRec = some1(string1, shape1({
    charset: string1,
    len: number1
}, [
    "charset"
]));
const matchesConfig = shape1({
    username: matchesStringRec,
    password: matchesStringRec
});
const matchesConfigFile = shape1({
    username: string1,
    password: string1
});
async function getConfig(effects) {
    const config = await effects.readJsonFile({
        volumeId: "main",
        path: "config.json"
    }).then((x)=>matchesConfig.unsafeCast(x)
    ).catch(()=>undefined
    );
    return {
        config,
        spec: {
            "tor-address": {
                name: "Tor Address",
                description: "The Tor address.",
                type: "pointer",
                subtype: "package",
                "package-id": "syncthing",
                target: "tor-address",
                interface: "main"
            },
            username: {
                type: "string",
                name: "Username",
                description: "The user for loging into the administration page of syncthing",
                nullable: false,
                copyable: true,
                masked: false,
                default: "admin"
            },
            password: {
                type: "string",
                name: "Password",
                description: "The password for loging into the administration page of syncthing",
                nullable: false,
                copyable: true,
                masked: true,
                default: {
                    charset: "a-z,A-Z,0-9",
                    len: 22
                }
            }
        }
    };
}
async function setConfig(effects, input) {
    effects.writeJsonFile({
        path: "./config.json",
        toWrite: {
            username: input?.username,
            password: input?.password
        },
        volumeId: "main"
    });
    return {
        signal: "SIGTERM",
        "depends-on": {}
    };
}
const matchesSyncthingSystem = shape1({
    myID: string1
});
async function properties(effects) {
    const syncthing_system_promise = effects.readJsonFile({
        volumeId: "main",
        path: "syncthing_stats.json"
    });
    const config_promise = effects.readJsonFile({
        volumeId: "main",
        path: "config.json"
    });
    const syncthing_system = matchesSyncthingSystem.unsafeCast(await syncthing_system_promise);
    const config = matchesConfigFile.unsafeCast(await config_promise);
    return {
        version: 2,
        data: {
            "Device Id": {
                type: "string",
                value: syncthing_system.myID,
                description: "his is the ID for syncthing to attach others to",
                copyable: true,
                qr: true,
                masked: false
            },
            Username: {
                type: "string",
                value: config.username,
                description: "Username to login to the UI",
                copyable: true,
                qr: false,
                masked: false
            },
            Password: {
                type: "string",
                value: config.password,
                description: "Password to login to the UI",
                copyable: true,
                qr: false,
                masked: true
            }
        }
    };
}
export { getConfig as getConfig };
export { setConfig as setConfig };
export { properties as properties };
