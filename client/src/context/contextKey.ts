/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */


/**
 * This list needs to match Server's LSP ContextKey
 * Server will ignore Key's not available in the server
 */
export enum ContextKey {
    GLOBAL = "GLOBAL",
    BEM = "BEM",
    DENSITY = "DENSITY",
    DEPRECATED = "DEPRECATED",
    INVALID = "INVALID",
    OVERRIDE = "OVERRIDE",
    UTILITY_CLASS = "UTILITY_CLASS",
    DESIGN_TOKEN = "DESIGN_TOKEN",
    AUTO_SUGGEST = "AUTO_SUGGEST"
}