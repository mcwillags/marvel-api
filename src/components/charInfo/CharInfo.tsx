import { Component } from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import MarvelService from '../../services/MarvelService';

import './charInfo.scss';

interface CharInfoProps {
    charId: number | null;
}

interface CharData {
    id?: number;
    name?: string;
    description?: string;
    thumbnail?: string;
    homepage?: string;
    wiki?: string;
    comics?: {
        items: Comic[]
    }
}

interface Comic {
    name: string;
    resourceURI: string;
}

interface RandomCharState {
    char: CharData | null;
    loading: boolean;
    error: boolean;
}

interface ViewProps {
    char: CharData;
}

class CharInfo extends Component<CharInfoProps, RandomCharState> {
    state: RandomCharState = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount(): void {
        this.updateChar();
    }

    componentDidUpdate(prevProps: Readonly<CharInfoProps>): void {
        if(this.props.charId !== prevProps.charId){
            this.updateChar();
        }
    }

    updateChar = () => {
        const {charId} = this.props;
        if(!charId){
            return;
        }

        this.onCharLoading();
        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    onCharLoaded = (char: CharData) => {
        this.setState({
            char, 
            loading: false
        });
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        });
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    render(){
        const {char, loading, error} = this.state;

        const skeleton = char || loading || error ? null : <Skeleton/>
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error || !char) ? <View char={char} /> : null;

        return (
            <div className="char__info">
               {skeleton}
               {errorMessage}
               {spinner}
               {content}
            </div>
        )
    }
}

const View = ({ char }: ViewProps) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char;
    let imgStyle = { objectFit: 'cover' as 'cover' | 'contain' };
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { objectFit: 'contain' };
    }
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics && comics.items.length > 0 ? (
                    comics.items.map((item, i) => (
                        <li key={i} className="char__comics-item">{item.name}</li>
                    ))
                ) : (
                    <li>No comics available</li>
                )}
            </ul>
        </>
    );
}

export default CharInfo;
