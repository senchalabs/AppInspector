/*
 This is a Siesta's own test suite. Do not copy from it, instead take a look on the /examples folder
 */

var Harness = Siesta.Harness.Browser.ExtJS

var harnessPreload  = [
    '../../extjs-4.2.2/resources/css/ext-all.css',
    '../../extjs-4.2.2/ext-all-debug.js',
    '../siesta-all.js',
    'lib/Siesta/Test/AssertionsTranslator.js'
]

Harness.configure({
    title                   : 'Siesta',
    
    autoCheckGlobals        : true,
    expectedGlobals         : [
        'Joose',
        'Class',
        'Role',
        'Module',
        'Singleton',
        'Scope',
        'JooseX',
        'Data',
        'Siesta',
        '$',
        'jQuery',
        /jQuery\d+/,
        'rootjQuery',
        'XRegExp',
        'SyntaxHighlighter',
        'Sch',
        'Harness',
        '__REFADR__',
        'CodeMirror',
        '__REFADR__',
        'InputBlocker' // Touch 2.3.0
    ],

    overrideSetTimeout     : false,
    activateDebuggerOnFail : false,
    // this should use 3 steps up and not 2, because its being used relative to the hostPageUrl 
    // tests/siesta_ui/601_siesta_ui.html 
    loaderPath             : { 'Ext.ux' : '../../../extjs-4.2.2/examples/ux' },

    testClass : Class({
        isa  : Siesta.Test.ExtJS,
        does : [
            Siesta.Test.Self,
            Siesta.Test.Self.ExtJS
        ]
    }),

    preload : harnessPreload
})


Harness.start(
    {
        group               : 'Sanity',
        
        items               : [
            'sanity/010_sanity.t.js',
            /webkit/i.test(navigator.userAgent) /*|| $.browser.msie && Number($.browser.version) >= 10*/
                ? 
                    {
                        url         : 'sanity/020_cmd_app_touch.t.js',
                        hostPageUrl : 'cmd_app_touch/build/production/TestApp/'
                    }
                :
                    null, 
            {
                url         : 'sanity/030_cmd_app_extjs.t.js',
                hostPageUrl : 'cmd_app_extjs/build/production/TestApp/'
            }
        ]
    },
    '011_function.t.js',
    '020_test.t.js',
    '021_begin_async.t.js',
    '021_assertions_1.t.js',
    '023_test_todo.t.js',
    '030_test_more.t.js',
    '031_test_more_chain.t.js',
    {
        group : 'Key events',

        items : [
            'keyevents/040_keyevent_simulation.t.js',
            'keyevents/041_keyevent_simulation2.t.js',
            'keyevents/042_keyevent_simulation3.t.js',
            'keyevents/043_special_keys.t.js',
            'keyevents/044_text_selection.t.js',
            'keyevents/045_cancel_keypress.t.js',
            'keyevents/046_type_with_options.t.js',
            'keyevents/047_enter_in_form.t.js',
            'keyevents/048_input_maxlength.t.js',
            'keyevents/049_enter_on_anchor.t.js',
            'keyevents/050_tab_key_focus.t.js',
            'keyevents/050_tab_key_focus2.t.js',
            'keyevents/050_tab_key_focus3.t.js',
            'keyevents/051_tabbing.t.js'
        ]
    },
    '201_function.t.js',
    {
        group : 'Visual tests',

        items : [
            '050_mouse_click.t.js',
            '050_mouse_click2.t.js',
            '050_targeting_normalization.t.js',
            '050_mouse_click_jquery.t.js',
            '051_mouse_overout.t.js',
            '051_mouse_overout_with_span.t.js',
            '052_mouse_move.t.js',
            '053_mouse_click_options.t.js',
            '054_mouse_click_not_visible.t.js',
            '055_mouseover_mouseenter.t.js',
            '056_is_element_scrolled_out.t.js',
            '056_click_element_scrolled.t.js',
            '056_click_element_scrolled2.t.js',
            '056_drag_element_scrolled.t.js',
            '057_click_blur.t.js',
            '058_isElementVisible.t.js',
            '060_element.t.js',
            '060_element2.t.js',
            '061_element_wait_for_selectors.t.js',
            '062_element_wait_for_event.t.js',

//            this is a TODO test
//            {
//                hostPageUrl     : 'blank.html',
//                preload         : harnessPreload,
//                
//                url             : '063_hashchange.t.js'
//            },
            '064_element_scroll_to.t.js',
            '065_targeting_array_offset.t.js',
            '066_text_present.t.js',
            '067_editable_nodes.t.js',
            {
                url                 : '068_activeElement.t.js',
                autoCheckGlobals    : false
            },
            '069_waitfor_stable_target.t.js',
            '070_chaining_with_actions.t.js',
            '070_action_shortcuts.t.js',
            '071_chain_click.t.js',
            '072_chaining_arguments.t.js',
            '074_chaining_eval.t.js'
        ]
    },
    '080_exception_parsing.t.js',
    {
        group : 'Utility classes',

        items : [
            'util/100_util_queue.t.js',
            {
                url      : 'util/110_util_serializer.t.js',
                // need to reach the "done" call, since in FF, serializing the `window.location` property
                // may cause a silent and undetectable exception
                needDone : true
            },
            'util/120_util_xml_node.t.js',
            'util/130_rect.t.js'
        ]
    },

    {
        group : 'Ext JS 4 layer',

        items : [
            '500_extjs_observable.t.js?Ext4',
            {
                hostPageUrl : '500_extjs_observable_hostpage.html',
                url         : '500_extjs_observable_hostpage.t.js'
            },
            {
                url      : '501_extjs_combo_autocomplete.t.js?Ext4',
                speedRun : false
            },
            '502_extjs_component.t.js?Ext4',
            '502_extjs_wait_for_cq.t.js?Ext4',
            '503_extjs_dataview.t.js?Ext4',
            '504_extjs_element.t.js?Ext4',
            '505_extjs_grid.t.js?Ext4',
            '506_extjs_observable.t.js?Ext4',
            '507_form_checkbox.t.js?Ext4',
            '509_waitfor_animations.t.js?Ext4',
            '510_extjs_require_singleton.t.js?Ext4',
            '530_extjs_composite_query.t.js?Ext4',
            '540_extjs_type.t.js?Ext4',
            '550_extjs_store.t.js?Ext4'
        ]
    },

    {
        group            : 'Ext JS 3 layer',
        autoCheckGlobals : false, // Ignore flash globals
        preload          : [
            "../../ext-3.4.0/resources/css/ext-all.css",
            "../../ext-3.4.0/adapter/ext/ext-base-debug.js",
            "../../ext-3.4.0/ext-all-debug.js",
            '../siesta-all.js',
            'lib/Siesta/Test/AssertionsTranslator.js'
        ],

        items : [
            '500_extjs_observable.t.js?Ext3',
//            {
//                url             : '501_extjs_combo_autocomplete.t.js?Ext3',
//                speedRun        : false
//            },
//            '502_extjs_component.t.js?Ext3',
//            '503_extjs_dataview.t.js?Ext3',
//            '504_extjs_element.t.js?Ext3',
//            '505_extjs_grid.t.js?Ext3',
//            '506_extjs_observable.t.js?Ext3',
//            '507_form_checkbox.t.js?Ext3',
//            '540_extjs_type.t.js?Ext3',
            '550_extjs_store.t.js?Ext3',
            'extjs-component/013_HTMLEditor.t.js?Ext3',
            {
                hostPageUrl : '../../ext-3.4.0/examples/button/buttons.html',
                url         : '508_extjs3_page.t.js'
            }
        ]
    },
    {
        group            : 'Siesta UI',
        hostPageUrl      : 'siesta_ui/601_siesta_ui.html',
        autoCheckGlobals : false,
        items            : [
            'siesta_ui/601_siesta_ui_line_number.t.js',
            'siesta_ui/602_siesta_ui_recursive_self.t.js',
            'siesta_ui/603_siesta_ui.t.js',
            'siesta_ui/604_siesta_ui2.t.js',
            'siesta_ui/605_siesta_ui_nbr_layouts.t.js',
            'siesta_ui/606_siesta_preload_404.t.js',
            'siesta_ui/608_keep_assertions.t.js',
            'siesta_ui/609_forced_iframe.t.js',
            'siesta_ui/610_cleanup_with_subtests.t.js',
            'siesta_ui/611_component_inspector2.t.js',
            'siesta_ui/612_domcontainer_sizing.t.js',
            'siesta_ui/613_version_check.t.js',
            'siesta_ui/614_version_check2.t.js',
            'siesta_ui/615_launch_same_test_repeatedly.t.js',
            'siesta_ui/616_waitfor_indication.t.js',
            'siesta_ui/617_row_statuses.t.js',
            'siesta_ui/618_settings_menu.t.js',
            'siesta_ui/619_play_buttons.t.js',
            'siesta_ui/620_test_buttons.t.js',
            {
                hostPageUrl : 'siesta_ui/siesta_ui_cov.html',
                url         : 'siesta_ui/621_coverage.t.js'
            }
        ].concat(
                // we disable the ghost cursor on IE
                $.browser.msie ? [] : 'siesta_ui/607_ghost_cursor.t.js'
            )
    },
    '300_iframe_events.t.js',

    // TODO: only show/launch sencha touch tests in Webkit
    /webkit/i.test(navigator.userAgent) /*|| $.browser.msie && Number($.browser.version) >= 10*/ ?
        {
            group               : 'Sencha Touch Tests',
            testClass           : Class({
                isa     : Siesta.Test.SenchaTouch,
                does    : Siesta.Test.Self
            }),
            preload : [
                "../../sencha-touch-2.3.0/resources/css/sencha-touch.css",
                "../../sencha-touch-2.3.0/sencha-touch-all-debug.js",
                "../siesta-touch-all.js",
                'lib/Siesta/Test/AssertionsTranslator.js'
            ],
            items               :  [
                'senchatouch/001_tap.js',
                'senchatouch/701_sencha_touch_form.t.js',
                'senchatouch/901_sencha_touch_events.t.js',
                'senchatouch/902_sencha_touch_drag.t.js',
                'senchatouch/903_waitfor_stable_target.t.js?touch'
            ]
        }
    : 
        [],

    '800_async_start_test.t.js',
    '801_camelcased_startTest.t.js',

    {
        group : 'BDD',

        items : [
            'bdd/010_structure.t.js',
            'bdd/011_iit.t.js',
            'bdd/020_placeholder.t.js',
            'bdd/030_expectations.t.js',
            'bdd/040_dom_in_subtest.t.js'
        ]
    },

    // don't run recorder tests in IE9, seems the event capturing handlers are not activated for simulated 
    // events in it. Probably related to the "simulateEventsWith" 
    $.browser.msie && Number($.browser.version) <= 9 ? null : {
        group : 'Recorder',

        items : [
            {
                group       : 'Recorder UI',
                autoCheckGlobals : false,
                alsoPreload : [
                    '../resources/css/siesta-all.css'
                ],
                items       : [
                    'recorder/ui/100_recorder_ui.t.js',
                    'recorder/ui/101_eventview_edit_actions.t.js',
                    'recorder/ui/102_eventview_type_column.t.js',
                    'recorder/ui/103_eventview_offset_column.t.js',
                    'recorder/ui/104_eventview_fn.t.js',
                    'recorder/ui/105_eventview_drag.t.js',
                    'recorder/ui/106_eventview_reorder.t.js',
                    'recorder/ui/107_eventview.t.js',
                    'recorder/ui/108_target_editor.t.js',
                    'recorder/ui/109_eventview_target_column.t.js'
                ]
            },
            {
                group       : 'Integration tests',
                hostPageUrl : 'siesta_ui/601_siesta_ui.html',
                items       : [
                    'recorder/integration/200_integration_1.t.js',
                    'recorder/integration/201_target_highlighting.t.js'
                ]
            },
            'recorder/001_sanity.t.js',
            'recorder/002_targeting.t.js',
            {
                forceDOMVisible : true,
                url : 'recorder/003_extjs_components_1.t.js'
            },
            'recorder/004_extjs_components_form_fields.t.js',
            'recorder/005_extjs_components_grid.t.js',
            {
                autoCheckGlobals : false,
                hostPageUrl      : '../../extjs-4.2.2/examples/themes/index.html',
                preload          : [
                    '../siesta-all.js',
                    'lib/Siesta/Test/AssertionsTranslator.js'
                ],
                url              : 'recorder/005_extjs_components_all.t.js'
            },
            'recorder/006_plain_html.t.js',
            'recorder/007_multistop_drag.t.js',
            'recorder/008_page_refresh.t.js',
            'recorder/009_menus.t.js',
            'recorder/010_slider.t.js',
            'recorder/011_extjs3.t.js',
            'recorder/012_extjs_components_dataview.t.js',
            'recorder/013_modkeys.t.js',
            'recorder/014_extjs_components_tabpanel.t.js',
            {
                alsoPreload          : [
                    '../../ExtScheduler2.x/sch-all-debug.js',
                    '../../ExtScheduler2.x/resources/css/sch-all.css'
                ],
                url              : 'recorder/015_scheduler.t.js'
            },
            'recorder/016_recorded_eventmodel.t.js',
            'recorder/017_moveCursor.t.js',
            'recorder/1000_code_generation.t.js',
            {
                alsoPreload : [
                    "../../ExtGantt2.x/resources/css/sch-gantt-all.css",
                    "../../ExtGantt2.x/gnt-all.js"
                ],
                url         : 'recorder/1100_gantt_integration_test.t.js'
            }
        ]
    },
    {
        group : 'Harness tests',

        items : [
            'harness/010_preload_hostpageurl.t.js'
        ]
    },
    {
        group : 'ExtJS component tests',

        items : [
            'extjs-component/010_hidden.t.js',
            'extjs-component/011_csq_nested.t.js',
            'extjs-component/012_cq.t.js',
            'extjs-component/013_HTMLEditor.t.js'
        ]
    }
)
