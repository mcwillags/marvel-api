import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

interface CharData {
    id: number;
    name?: string;
    description?: string;
    thumbnail?: string;
    homepage?: string;
    wiki?: string;
}

interface CharListState {
    charList: CharData[];
    loading: boolean;
    error: boolean;
    newItemLoading:boolean;
    offset: number;
    charEnded: boolean
}

interface CharListProps {
    onCharSelected: (id: number) => void;
}

class CharList extends Component<CharListProps, CharListState> {
    state: CharListState = {
        charList: [],
        loading: true,
        error:false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset: number = 210) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }
    
    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList: CharData[]) => {
        let ended = false;
        if(newCharList.length < 9){
            ended = true;
        }
        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    renderItems(arr: CharData[]): JSX.Element {
        const items = arr.map((item: CharData, index: number) => {
            let imgStyle = { objectFit: 'cover' as 'cover' | 'unset' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { objectFit: 'unset' };
            }
    
            return (
                <li 
                    className="char__item"
                    key={item.id ? item.id : index}
                    onClick={() => this.props.onCharSelected(item.id)}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            );
        });
    
        return (
            <ul className="char__grid">
                {items}
            </ul>
        );
    }

    render(){
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}
export default CharList;