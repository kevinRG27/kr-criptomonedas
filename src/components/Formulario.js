import React, {useEffect,useState} from 'react';
import styled from '@emotion/styled'

import useMoneda from '../hooks/useMoneda';
import useCriptomoneda from '../hooks/useCriptomoneda';
import Error from './Error';
import axios from 'axios';

const Boton = styled.input`
    margin-top: 20px;
    font-weight: bold;
    font-size: 20px;
    padding: 10px;
    background-color: #66a2fe;
    border: none;
    width: 100%;
    border-radius: 10px;
    color: #FFF;
    transition: background-color .3s ease;

    &:hover {
        background-color: #326ac0;
        cursor: pointer;
    }
    
`;

const Formulario = ({guardarMoneda, guardarCriptomoneda}) => {

    //Arreglo de Criptomonedas con useState
    const [CRIPTOMONEDAS, guardarCRIPTOMONEDAS] = useState([]);

    //State para validar el Formulario
    const [error, guardarError] = useState(false)

    //Arreglo de monedas
    const MONEDAS = [
        {codigo: 'USD', nombre: 'Dolar de Estados Unidos'},
        {codigo: 'MXN', nombre: 'Peso Mexicano'},
        {codigo: 'EUR', nombre: 'Euro'},
        {codigo: 'GBP', nombre: 'Libra Esterlina'},
        {codigo: 'COP', nombre: 'Peso Colombiano'}
    ]

    //Utilizar useMoneda
    const [ moneda, SelectMonedas] = useMoneda('Elige tu moneda: ','',MONEDAS);

    //Utilizar useCriptomoneda
    const [ criptomoneda, SelectCripto] = useCriptomoneda('Elige tu criptomoneda: ','',CRIPTOMONEDAS);

    //Ejecutar llamado a la API para las criptomonedas
    useEffect(() => {
        const consultarAPI = async () => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
            const resultado = await axios.get(url);
            guardarCRIPTOMONEDAS(resultado.data.Data);
        }
        consultarAPI();
    }, []);

    //Validar formulario
    const cotizarMoneda = (e) => {
        e.preventDefault();

        //verificar campos vacios
        if(moneda ==='' || criptomoneda === ''){
            guardarError(true)
            return;
        }

        //Pasar datos al componente principal
        guardarError(false);
        guardarMoneda(moneda);
        guardarCriptomoneda(criptomoneda);
        
    }



    return ( 
        <form
            onSubmit={cotizarMoneda}
        >
            {error? <Error mensaje = 'Todos los campos son obligatorios'/> : null}
            <SelectMonedas />
            <SelectCripto />
            <Boton
                type="submit"
                value="Calcular"
            />
        </form>

     );
}
 
export default Formulario;