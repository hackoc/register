import { useState, uesEffet, useEffect, useRef } from 'react';
import styles from './Select.module.css';

function defaultValidate (text) {
    return text?.length;
}

export default function Select (props) {
    const { options = [], special, validate: _validate, name, description, help, placeholder, data, setData, initialData, wrapperClass, width, margin, type, id: _id, required } = props;

    const id = _id ?? name?.toLowerCase()?.split(' ')?.join('-')?.split('')?.filter(a => `abcdefghijklmnopqrstuvwxyz1234567890-_`.includes(a))?.join('') ?? 'error';
    const validate = data => (_validate ?? defaultValidate)() && (required ? data?.length : true);

    const [localData, setLocalData] = useState(initialData ?? '');
    const [valid, setValid] = useState(false);
    const [partiallyValid, setPartiallyValid] = useState(false);

    const inputRef = useRef(null);

    const multiSelect = options.filter(opt => opt?.custom).length > 0;

    const presetChips = options.filter(opt => !opt?.custom).map((opt, i) => ({
        name: opt,
        color: i % 7,
    }));

    const [displayedPresetChips, setDisplayedPresetChips] = useState(presetChips);

    const [chips, setChips] = useState([
    ]);

    const [activeColor, setActiveColor] = useState(0);

    const [counter, setCounter] = useState(Math.random() * 6 | 0);

    useEffect(() => {
        console.log('a')
        let excluded = presetChips.filter(presetChip => !chips.map(chip => chip.name).includes(presetChip.name));
        if (localData?.length) {
            setDisplayedPresetChips(excluded.filter(chip => chip.name.toLowerCase().split(' ').join('').includes(localData.toLowerCase().split(' ').join(''))));
        } else {
            setDisplayedPresetChips(excluded);
        }
    }, [chips, localData, counter]);

    function forceUpdate () {
        setCounter(counter + 1);
    }

    console.log(displayedPresetChips);

    return (
        <>
            <div className={[wrapperClass, styles.wrapper, valid && styles.isValid, partiallyValid && !valid && styles.isPartiallyValid].filter(l => l).join(' ')} style={{
                width: width ?? '300px',
                margin: margin ?? '0px',
                boxSizing: 'border-box'
            }}>
                <label for={id}>{name} {help && <span><span aria-label={help} tabIndex={0}>?</span></span>}</label>
                <p>{description}</p>
                <div className={styles.content} onClick={() => inputRef.current.focus()}>
                    {chips.map(chip => (
                        <span data-color={chip.color} className={styles.chip} key={chip.id} onClick={e => {
                            let index = 0;
                            chips.forEach((c, i) => (c.id == chip.id ? index = i : 0));
                            let theseChips = JSON.parse(JSON.stringify(chips));
                            theseChips.splice(index, 1);
                            setChips(theseChips);
                        }}>{chip.name}</span>
                    ))}
                    <input onChange={e => {
                        setLocalData(e.target.value);
                        if (setData instanceof Function) setData(e.target.value);
                        setPartiallyValid(validate(e.target.value));
                    }} onKeyDown={e => {
                        if (e.key == 'Backspace' && e.target.value?.length == 0) {
                            let theseChips = JSON.parse(JSON.stringify(chips));
                            theseChips.pop();
                            setChips(theseChips);
                        } else if ((e.key == 'Enter' || e.key == ',') && multiSelect) {
                            if (e.key == ',') e.preventDefault();
                            let theseChips = JSON.parse(JSON.stringify(chips));
                            theseChips.push({
                                name: displayedPresetChips.length ? displayedPresetChips[0].name : localData.trim(),
                                color: displayedPresetChips.length ? displayedPresetChips[0].color :  activeColor,
                                id: localData.toLowerCase().split(' ').join('-')
                            });
                            setActiveColor(Math.random() * 6 | 0);
                            setChips(theseChips);
                            e.target.value = '';
                            setLocalData('');
                            if (setData instanceof Function) setData('');
                        }
                    }}
                    name={id} id={id} type={type} onBlur={() => {
                        setValid(validate(localData));
                    }} onFocus={e => {
                        setValid(false);
                    }} ref={inputRef} value={localData}></input>
                </div>
                <span>✓</span>
                <div className={styles.dropdown} tabIndex="-1" onFocus={() => inputRef.current.focus()}>
                    {displayedPresetChips.map(chip => (
                        <div className={styles.chipOption} onMouseDown={e => {
                            let index = 0;
                            presetChips.forEach((c, i) => (c.name == chip.name ? index = i : 0));
                            let thesePresetChips = JSON.parse(JSON.stringify(presetChips));
                            let theseChips = chips;
                            let thisChip = thesePresetChips.splice(index, 1)[0];
                            theseChips.push({
                                name: thisChip.name,
                                color: thisChip.color,
                                id: Math.floor(Math.random() * 10000) + '-' + Date.now()
                            });
                            setChips(theseChips);
                            forceUpdate();
                        }}>
                            <span data-color={chip.color} className={styles.chip} key={Math.floor(Math.random() * 10000) + '-' + Date.now()}>{chip.name}</span>
                        </div>
                    ))}
                    {localData?.length ? 
                        <div className={styles.chipOption} onMouseDown={e => {
                            let theseChips = JSON.parse(JSON.stringify(chips));
                            theseChips.push({
                                name: localData,
                                color: activeColor,
                                id: Math.floor(Math.random() * 10000) + '-' + Date.now()
                            });
                            setChips(theseChips);
                            setActiveColor(Math.random() * 6 | 0);
                            setLocalData('');
                            forceUpdate();
                        }}>
                            Add <span data-color={activeColor} className={styles.chip} key={Math.floor(Math.random() * 10000) + '-' + Date.now()}>{localData}</span>
                        </div>
                    : null}
                </div>
            </div>
        </>
    )
}