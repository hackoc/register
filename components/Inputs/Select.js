import { useState, uesEffet, useEffect, useRef } from 'react';
import styles from './Select.module.css';

function defaultValidate (text) {
    return text?.length;
}

function isVisible (ele, container) {
    if (!container) container = ele.parentElement;

    const eleTop = ele.offsetTop;
    const eleBottom = eleTop + ele.clientHeight;

    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    // The element is fully visible in the container
    return (
        (eleTop >= containerTop && eleBottom <= containerBottom) ||
        // Some part of the element is visible in the container
        (eleTop < containerTop && containerTop < eleBottom) ||
        (eleTop < containerBottom && containerBottom < eleBottom)
    );
}

function scrollParentToChild (child, parent) {
    // Where is the parent on page
    if (!parent) parent = child.parentElement;
    var parentRect = parent.getBoundingClientRect();
    // What can you see?
    var parentViewableArea = {
        height: parent.clientHeight,
        width: parent.clientWidth
    };
    
    // Where is the child
    var childRect = child.getBoundingClientRect();
    // Is the child viewable?
    var isViewable = (childRect.top >= parentRect.top) && (childRect.bottom <= parentRect.top + parentViewableArea.height);
    
    // if you can't see the child try to scroll parent
    if (!isViewable) {
        // Should we scroll using top or bottom? Find the smaller ABS adjustment
        const scrollTop = childRect.top - parentRect.top;
        const scrollBot = childRect.bottom - parentRect.bottom;
        if (Math.abs(scrollTop) < Math.abs(scrollBot)) {
            // we're near the top of the list
            parent.scrollTop += scrollTop;
        } else {
            // we're near the bottom of the list
            parent.scrollTop += scrollBot;
        }
    }
    
}
    

function looseMatch (str1, str2) {
    const modify = str => str?.toLowerCase()?.split('')?.filter(a => `abcdefghijklmnopqrstuvwxyz1234567890`.includes(a))?.join('') ?? '';
    return modify(str1) == modify(str2);
}

export function Chip ({ chipData: chip, forceUpdate, chips, setChips, multiSelect, presetChips, localData, isCustom, isSelected, resetSelected, selectThisChip }) {
    const selfRef = useRef(null);

    useEffect(() => {
        if (!isVisible(selfRef.current)) {
            console.log(' .   fgd f')
            scrollParentToChild(selfRef.current);
        }
    }, [isSelected]);

    return (
        <div onMouseMove={selectThisChip} ref={selfRef} className={[styles.chipOption, isSelected ? styles.selectedChip : ''].join(' ')} onMouseDown={e => {
            if (isCustom) {
                e.preventDefault();
                resetSelected(0);
                let theseChips = JSON.parse(JSON.stringify(chips));
                theseChips.push({
                    name: localData,
                    color: chip.color,
                    id: Math.floor(Math.random() * 10000) + '-' + Date.now()
                });
                setChips(theseChips);
                setActiveColor(Math.random() * 6 | 0);
                setLocalData('');
                forceUpdate();
            } else {
                e.preventDefault();
                resetSelected(0);
                let index = 0;
                presetChips.forEach((c, i) => (c.name == chip.name ? index = i : 0));
                let thesePresetChips = JSON.parse(JSON.stringify(presetChips));
                let theseChips = chips;
                let thisChip = thesePresetChips.splice(index, 1)[0];
                if (multiSelect) theseChips.push({
                    name: thisChip.name,
                    color: thisChip.color,
                    id: Math.floor(Math.random() * 10000) + '-' + Date.now()
                });
                else theseChips = [
                    {
                        name: thisChip.name,
                        color: thisChip.color,
                        id: Math.floor(Math.random() * 10000) + '-' + Date.now()
                    }
                ];
                setChips(theseChips);
                forceUpdate();
            }
        }}>
            {isCustom && 'Add '} <span data-color={chip.color} className={styles.chip} key={Math.floor(Math.random() * 10000) + '-' + Date.now()}>{chip.name} <span className={styles.close}>×</span></span>
        </div>
    );
}

export default function Select (props) {
    const { multi, options = [], special, validate: _validate, name, description, help, placeholder, data, setData, initialData, wrapperClass, width, margin, type, id: _id, required } = props;

    const [selected, setSelected] = useState(0);

    const id = _id ?? name?.toLowerCase()?.split(' ')?.join('-')?.split('')?.filter(a => `abcdefghijklmnopqrstuvwxyz1234567890-_`.includes(a))?.join('') ?? 'error';
    const validate = data => (_validate ?? defaultValidate)() && (required ? data?.length : true);

    const [localData, setLocalData] = useState(initialData ?? '');
    const [valid, setValid] = useState(false);
    const [partiallyValid, setPartiallyValid] = useState(false);

    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    const custom = options.filter(opt => opt?.custom).length > 0;
    const multiSelect = multi;

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

    function startEdits () {
        setValid(false);
        setPartiallyValid(validate(chips));
    }

    function finishEdits () {
        setValid(validate(chips));
    }

    function resetSelected () {
        setSelected(0);
    }

    const displayedChips = [

        ...(displayedPresetChips.filter(chip => looseMatch(chip.name, localData))[0] ? [displayedPresetChips.filter(chip => looseMatch(chip.name, localData))[0]] : []).map(chip => ({ chip })),
        ...displayedPresetChips.filter(chip => !looseMatch(chip.name, localData)).map(chip => ({ chip })),
        ...((localData?.length && custom) ? [{
            name: localData?.trim(),
            color: activeColor
        }] : []).map(chip => ({ chip, isCustom: true }))
    ];

    return (
        <>
            <div className={[wrapperClass, styles.wrapper, valid && styles.isValid, partiallyValid && !valid && styles.isPartiallyValid].filter(l => l).join(' ')} style={{
                width: width ?? '300px',
                margin: margin ?? '0px',
                boxSizing: 'border-box'
            }}>
                <label for={id}>{name} {help && <span><span aria-label={help} tabIndex={0}>?</span></span>}</label>
                <p>{description}</p>
                <div className={styles.content} onBlur={finishEdits} onClick={e => (e.preventDefault(), inputRef.current.focus(), dropdownRef.current.scrollTop = 0, startEdits(), setSelected(0))} onKeyDown={e => {
                    if (e.key == 'ArrowDown') {
                        setSelected((selected + 1 + displayedChips.length) % displayedChips.length);
                        console.log(e.key, e.target.contains(document.activeElement));
                    } else if (e.key == 'ArrowUp') {
                        setSelected((selected - 1 + displayedChips.length) % displayedChips.length);
                        console.log(e.key, e.target.contains(document.activeElement));
                    }
                }}>
                    {chips.map(chip => (
                        <span onMouseDown={e => e.preventDefault()} data-color={chip.color} className={styles.chip} key={chip.id}>{chip.name} <span className={styles.close} onClick={e => {
                            let index = 0;
                            chips.forEach((c, i) => (c.id == chip.id ? index = i : 0));
                            let theseChips = JSON.parse(JSON.stringify(chips));
                            theseChips.splice(index, 1);
                            setChips(theseChips);
                        }}>×</span></span>
                    ))}
                    <input placeholder={chips?.length == 0 ? 'Select' : ''} onChange={e => {
                        setLocalData(e.target.value);
                        if (setData instanceof Function) setData(e.target.value);
                        setPartiallyValid(validate(e.target.value));
                    }} onKeyDown={e => {
                        if (e.key == 'Backspace' && e.target.value?.length == 0) {
                            let theseChips = JSON.parse(JSON.stringify(chips));
                            theseChips.pop();
                            setChips(theseChips);
                        } else if ((e.key == 'Enter' || e.key == ',')) {
                            let activeChip = displayedChips[selected].chip;
                            console.log({ activeChip });
                            if (e.key == ',') e.preventDefault();
                            let theseChips = JSON.parse(JSON.stringify(chips));
                            if (!displayedPresetChips.length && !custom) return;
                            if (multiSelect) theseChips.push({
                                name: activeChip.name,
                                color: activeChip.color,
                                id: localData.toLowerCase().split(' ').join('-')
                            });
                            else theseChips = [
                                {
                                    name: activeChip.name,
                                    color: activeChip.color,
                                    id: localData.toLowerCase().split(' ').join('-')
                                }
                            ];
                            setActiveColor(Math.random() * 6 | 0);
                            setChips(theseChips);
                            e.target.value = '';
                            setLocalData('');
                            resetSelected();
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
                <div className={styles.dropdown} ref={dropdownRef} tabIndex="-1" onFocus={() => inputRef.current.focus()} onMouseDown={startEdits}>
                    {displayedChips.map(({ chip, isCustom }, i) => <Chip chipData={chip} {...{
                        forceUpdate,
                        chips,
                        setChips,
                        multiSelect,
                        presetChips,
                        localData,
                        isCustom,
                        resetSelected,
                        isSelected: selected == i,
                        selectThisChip: () => setSelected(i)
                    }} />)}
                </div>
            </div>
        </>
    )
}