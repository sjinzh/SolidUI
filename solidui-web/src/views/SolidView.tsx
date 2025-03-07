/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import { Emitter } from "mitt";
import {
	EventBusType,
	OnDragEventData,
	OnResizeEventData,
	OnReiszeGroupEventData,
	OnUpdateViewPropertyValueEventData,
	onDataSetChangeEventData,
} from "@/types/eventbus";

import { SolidModelDataType, SolidViewDataType } from "@/types/solid";
import { set, cloneDeep } from "lodash-es";
import Apis from "@/apis";
import { ApiResult } from "@/types";

export interface SolidViewProps {
	id: string;
	className?: string;
	style?: React.CSSProperties;
	viewModel: SolidViewDataType;
	"solidui-element-id"?: string;
	eventbus?: Emitter<EventBusType>;
	scenaAttrs?: any;
}

export interface SolidViewState {
	viewModel: SolidViewDataType;
}

export default abstract class SolidView<
	T extends SolidViewProps,
	S extends SolidViewState = SolidViewState,
> extends React.Component<T, S> {
	dataSheet: any[] = [];
	xs: { label: string }[] = [];
	ys: { label: string }[] = [];
	private viewRef = React.createRef<HTMLDivElement>();
	private vm: SolidViewDataType;
	private id: string;
	private eventbus: Emitter<EventBusType>;

	protected constructor(props: T) {
		super(props);

		this.id = props["solidui-element-id"] as string;
		this.eventbus = props.eventbus!;
		this.vm = this.props.viewModel || {};

		// abstract methods
		this.renderView = this.renderView.bind(this);
		this.baseViewDidMount = this.baseViewDidMount.bind(this);
		this.baseViewWillUnmount = this.baseViewWillUnmount.bind(this);

		// private methods
		this.fetchDataAndReRender = this.fetchDataAndReRender.bind(this);
		this.reRender = this.reRender.bind(this);
		this.fetchData = this.fetchData.bind(this);
	}

	/// / ------------------------------------------------------------------
	/// / abstract methods
	protected abstract renderView(): React.ReactNode;
	protected abstract baseViewDidMount(): void;
	protected abstract baseViewWillUnmount(): void;
	protected abstract reRender(): void;
	protected abstract resize(): void;

	/// / ------------------------------------------------------------------
	/// / protected methods
	protected renderTitle(): React.ReactNode {
		// let viewModel = this.props.viewModel;
		// let viewModel = this.state.viewModel;
		let viewModel = this.vm;
		let options = viewModel.options || {};
		let title = options.title || {};
		let style = title.style || {};
		let { show } = title;
		if (show) {
			return (
				<div className="solid-view-title" style={style}>
					{title.text}
				</div>
			);
		}
		return null;
	}

	/// / ------------------------------------------------------------------
	/// / private methods
	private readonly fetchDataAndReRender = async () => {
		await this.fetchData();
		this.reRender();
	};

	private readonly fetchData = async () => {
		let viewModel = this.vm;
		let data = viewModel.data || {};
		let dsId = data.dataSourceId;
		let { sql } = data;
		if (!dsId || !sql) {
			this.dataSheet = viewModel.data.dataset || [];
			return;
		}

		let res: ApiResult<any[][]> = await Apis.datasource.querySql({
			dataSourceName: data.dataSourceName,
			typeName: data.dataSourceTypeName,
			sql,
		});
		if (res.ok) {
			this.dataSheet = res.data || [];
		}
	};

	async componentDidMount() {
		await this.fetchData();

		this.baseViewDidMount();
		this.eventbus.on("onResize", this.handleResize);
		this.eventbus.on("onResizeGroup", this.handleResizeGroup);
		this.eventbus.on(
			"onUpdateViewPropertyValue",
			this.handleUpdateViewPropertyValue,
		);
		this.eventbus.on("onDataSetChange", this.handleDataSetChange);
	}

	protected handleDrag = (evt: OnDragEventData) => {};

	protected handleResize = (evt: OnResizeEventData) => {
		this.resize();
	};

	protected handleDataSetChange = (evt: onDataSetChangeEventData) => {
		if (evt.id === this.id) {
			this.dataSheet = evt.data || [];
			this.reRender();
		}
	};

	protected getXs(): Array<{ label: string }> {
		return [
			{
				label: this.dataSheet[0][0],
			},
		];
	}

	protected getYs(): { label: string }[] {
		let ys: { label: string }[] = [];
		for (let i = 1; i < this.dataSheet.length; i++) {
			ys.push({ label: this.dataSheet[0][i] });
		}
		return ys;
	}

	protected handleUpdateViewPropertyValue = (
		evt: OnUpdateViewPropertyValueEventData,
	) => {
		if (this.id === evt.id) {
			let clonedVM = cloneDeep(this.vm);
			set(clonedVM, evt.property, evt.value);
			this.vm = clonedVM;
			this.forceUpdate();
			this.reRender();
		}
	};

	protected handleResizeGroup = (evt: OnReiszeGroupEventData) => {
		for (let key in evt) {
			if (key === this.id) {
				this.resize();
				break;
			}
		}
	};

	async componentWillUnmount() {}

	async componentDidUpdate(
		prevProps: Readonly<T>,
		prevState: Readonly<{}>,
		snapshot?: any,
	) {
		// let viewModel = this.state.viewModel;
		let viewModel = this.vm;
		// let viewModel = this.props.viewModel;
		// let metadata = viewModel.metadata || {};
		// if (viewModel.reFetch) {
		// 	await this.fetchData();
		// }

		this.reRender();
	}

	render() {
		let { viewModel, className, style, eventbus, scenaAttrs, ...restProps } =
			this.props;
		return (
			<div
				className={className}
				style={{
					position: "relative",
					width: "100%",
					height: "100%",
					zIndex: 1,
					padding: 5,
					...style,
				}}
				ref={this.viewRef}
				{...restProps}
			>
				{this.renderTitle()}
				{this.renderView()}
			</div>
		);
	}
}
