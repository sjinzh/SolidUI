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

import SolidViewFactory from "../SolidViewFactory";

export interface ViewCategory {
	key: string;
	title: string;
}

export type ViewType = "echarts_bar" | "echarts_line" | "echarts_pie";

export default abstract class ViewBuilder {
	constructor(protected factory: SolidViewFactory) {
		factory.register(this);
	}

	abstract createModel(): any;

	abstract getFrame(): any;

	abstract getComponentType(): any;

	abstract getId(): string;

	abstract getCategory(): ViewCategory;

	abstract getTitle(): string;

	abstract getType(): ViewType;

	abstract getIcon(): string;

	abstract getImage(): string;

	abstract getDescription(): string;
}
