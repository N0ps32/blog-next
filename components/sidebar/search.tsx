import React, {ChangeEvent, KeyboardEvent} from 'react';
import Card from '../layout/card';
import Router from 'next/router'
import {Key} from 'ts-key-enum';
import {Button} from '../misc/button';

interface SearchState {
    query: string;
    loading: boolean;
}

export default class Search extends React.Component<any, SearchState> {

    private mounted: boolean = false;

    constructor(props) {
        super(props);
        this.state = {query: '', loading: false};
        this.updateQuery = this.updateQuery.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.performSearch = this.performSearch.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    private async performSearch() {
        if (this.state.loading) {
            return;
        }

        this.setState({loading: true});
        const query = this.state.query;
        await Router.push({
            pathname: '/search',
            query: {query},
        });

        if (this.mounted) {
            this.setState({loading: false, query: ''});
        }
    }

    private onKeyDown(ev: KeyboardEvent<HTMLElement>): any {
        if (ev.key === Key.Enter) {
            this.performSearch();
        }
    }

    private updateQuery(ev: ChangeEvent<HTMLInputElement>) {
        this.setState({query: ev.currentTarget.value});
    }

    render() {
        return (
            <Card>
                <div className="px-4 py-4">
                    <label htmlFor="search" className="text-2xl font-light">Search</label>
                    <div className="h-9 flex border-b border-blue mt-5">
                        <input className="flex-shrink w-full h-full bg-gray-very-light px-4"
                               onKeyDown={this.onKeyDown}
                               onChange={this.updateQuery}
                               type="text"
                               value={this.state.query}
                               id="search"/>
                        <Button onInteract={this.performSearch}>
                            <img className="max-w-none -mx-1 relative -bottom-0.5" alt="Search"
                                 src="/assets/img/icons/search.svg" width={20} height={20}/>
                        </Button>
                    </div>
                </div>
            </Card>
        );
    }

}
