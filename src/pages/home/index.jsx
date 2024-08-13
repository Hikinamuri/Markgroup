import cl from './index.module.scss';
import { useEffect, useState } from 'react';

import { getAllCurrency } from '../../api/getAllCurrency';
import { getRUBRates } from '../../api/getRUBRates';

export const HomePage = () => {
    const [data, setData] = useState();
    const [rubRates, setRubRates] = useState();
    const [userValue, setUserValue] = useState(100);
    const [firstCurrency, setFirstCurrency] = useState();
    const [secondCurrency, setSecondCurrency] = useState();
    const [result, setResult] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const stateUpdateFunctions = {
        userValue: setUserValue,
        firstCurrency: setFirstCurrency,
        secondCurrency: setSecondCurrency,
    };

    const handleChange = (event) => {
        const name= event.target.name;
        const value = event.target.value;

        if (stateUpdateFunctions[name]) {
            stateUpdateFunctions[name](value)
        }
    }

    const getPrice = () => {
        const firstPrice = data.Valute[firstCurrency]?.Value || 1;
        const secondPrice = data.Valute[secondCurrency]?.Value || 1;
        const result = ((userValue * firstPrice) / secondPrice).toFixed(3);
        setResult(result)
    }

    const getChunks = () => {
        if (data && data.Valute) {
            const dataEntries = Object.entries(data.Valute);
            const chunkSize = Math.ceil(dataEntries.length / 4);
            return [
                dataEntries.slice(0, chunkSize),
                dataEntries.slice(chunkSize, 2 * chunkSize),
                dataEntries.slice(2 * chunkSize, 3 * chunkSize),
                dataEntries.slice(3 * chunkSize)
            ];
        }
        return [[], [], [], []];
    };

    const chunks = getChunks();

    const fetсhData = async () => {
        try {
            const response = await getAllCurrency()
            const rates = await getRUBRates()
            setRubRates(rates.data);
            
            setIsLoading(false)
            setData(response.data);
        } catch {
            null
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            getPrice();
        }
    }

    useEffect(() => {
        fetсhData()
    }, [])

    return (
        <div className={cl.home}>
            <h1>Калькулятор валюты</h1>
            <div className={cl.converter}>
                <div className={cl.converter__insert}>
                    <input 
                        className={cl.converter__input} 
                        type="number" 
                        name='userValue'
                        value={userValue}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                    <div className={cl.converter__selects}>
                        <select name="firstCurrency" value={firstCurrency} onChange={handleChange}>
                            <option value=''>RUB</option>
                            {!isLoading && data && data.Valute ? (
                                Object.entries(data.Valute).map(([key, value]) => (
                                    <option key={key} value={value.CharCode}>
                                        {value.CharCode}
                                    </option>
                                ))
                            ) : (
                                <option>Пусто</option>
                            )}
                        </select>
                        <div className={cl.converter__selects__line}></div>
                        <select name='secondCurrency' value={secondCurrency} onChange={handleChange}>
                            <option value=''>RUB</option>
                            {!isLoading && data && data.Valute ? (
                                Object.entries(data.Valute).map(([key, value]) => (
                                    <option key={key} value={value.CharCode}>
                                        {value.CharCode}
                                    </option>
                                ))
                            ) : (
                                <option>Пусто</option>
                            )}
                        </select>
                    </div>
                </div>
                <div className={cl.calculation_button} onClick={getPrice}>
                    <p>Рассчитать</p>
                </div>
            </div>
            {result ? (
                    <p className={cl.resultPrice}>{userValue} {data.Valute[firstCurrency]?.Name || 'Российский рубль'}  = {result} {data.Valute[secondCurrency]?.Name || 'Российский рубль'}</p>
                ) : (
                    null
                )
            }
            <div className={cl.block_container}>
                <div className={cl.block_container__rates}>
                    <h3>Ставки рубля к другим валютам</h3>
                    <div className={cl.block_container__rates_list}>
                        {!isLoading && rubRates && rubRates.rates ? (
                            Object.entries(rubRates.rates).map(([key, value]) => (
                                <div key={key}>{key} - {value.toFixed(4)}</div>
                            ))
                        ) : (
                            <span>Ждем-с</span>
                        )}
                    </div>
                </div>
                <div className={cl.block_container__valute}>
                    <h3>Курс валют в рублях</h3>
                    {chunks.map((chunk, index) => (
                        <div className={cl[`block_container__valute_${['first', 'second', 'third', 'fourth'][index]}`]} key={index}>
                            {chunk.map(([key, value]) => (
                                (value.Value > value.Previous) ? (
                                    <p key={key}>{key}: {value.Value} &#9650;</p>
                                ) : (
                                    <p key={key}>{key}: {value.Value} &#9660;</p>
                                )
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}