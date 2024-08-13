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
        const targetName = event.target.name;
        let value = event.target.value;
        console.log(value)

        if (stateUpdateFunctions[targetName]) {
            stateUpdateFunctions[targetName](value)
        }
    }

    const getPrice = () => {
        let firstPrice = data.Valute[firstCurrency]?.Value || 1;
        let secondPrice = data.Valute[secondCurrency]?.Value || 1;

        const result = ((userValue * firstPrice) / secondPrice).toFixed(3);
        setResult(result)
    }

    useEffect(() => {
        const fetshData = async () => {
            try {
                // const response = await getAllCurrency()
                const rates = await getRUBRates()
                setRubRates(rates.data);
                // setData(response.data);
                setIsLoading(false)
            }
            catch {null}
        }
        fetshData()
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
                    />
                    <div className={cl.converter__selects}>
                        <select name="firstCurrency" onChange={handleChange}>
                            <option value=''>RUB</option>
                            {!isLoading && data && data.Valute ? (
                                Object.entries(data.Valute).map(([key, value]) => (
                                    <option key={key} value={value.CharCode}>{value.CharCode}</option>
                                ))
                            ) : (
                                <option>Пусто</option>
                            )}
                        </select>
                        <div className={cl.converter__selects__line}></div>
                        <select name='secondCurrency' onChange={handleChange}>
                            <option value=''>RUB</option>
                            {!isLoading && data && data.Valute ? (
                                Object.entries(data.Valute).map(([key, value]) => (
                                    <option key={key} value={value.CharCode}>{value.CharCode}</option>
                                ))
                            ) : (
                                <option>Пусто</option>
                            )}
                        </select>
                    </div>
                </div>
                <div onClick={getPrice}>
                    <p>Рассчитать</p>
                </div>
            </div>
            <span>{result}</span>
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
                    <div className={cl.block_container__valute_value}></div>
                    <div className={cl.block_container__valute_value}></div>
                    <div className={cl.block_container__valute_value}></div>
                    <div className={cl.block_container__valute_value}></div>
                </div>
            </div>
        </div>
    )
}