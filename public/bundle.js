
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop$2(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop$2(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }

    /** regex of all html void element names */
    const void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
    function is_void(name) {
        return void_element_names.test(name) || name.toLowerCase() === '!doctype';
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.50.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function validate_dynamic_element(tag) {
        const is_string = typeof tag === 'string';
        if (tag && !is_string) {
            throw new Error('<svelte:element> expects "this" attribute to be a string.');
        }
    }
    function validate_void_dynamic_element(tag) {
        if (tag && is_void(tag)) {
            throw new Error(`<svelte:element this="${tag}"> is self-closing and cannot have content.`);
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\lib\Prompts\Question.svelte generated by Svelte v3.50.1 */

    const file$9 = "src\\lib\\Prompts\\Question.svelte";

    function create_fragment$a(ctx) {
    	let wrapper;
    	let h3;
    	let t;

    	const block = {
    		c: function create() {
    			wrapper = element("wrapper");
    			h3 = element("h3");
    			t = text(/*text*/ ctx[0]);
    			add_location(h3, file$9, 5, 2, 56);
    			add_location(wrapper, file$9, 4, 0, 43);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, wrapper, anchor);
    			append_dev(wrapper, h3);
    			append_dev(h3, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) set_data_dev(t, /*text*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(wrapper);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Question', slots, []);
    	let { text } = $$props;
    	const writable_props = ['text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Question> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ text });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text];
    }

    class Question extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Question",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<Question> was created without expected prop 'text'");
    		}
    	}

    	get text() {
    		throw new Error("<Question>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Question>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\lib\Prompts\Answer.svelte generated by Svelte v3.50.1 */
    const file$8 = "src\\lib\\Prompts\\Answer.svelte";

    function create_fragment$9(ctx) {
    	let wrapper;
    	let p;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			wrapper = element("wrapper");
    			p = element("p");
    			t = text(/*text*/ ctx[0]);
    			attr_dev(p, "class", "svelte-1cql8sl");
    			add_location(p, file$8, 18, 2, 358);
    			attr_dev(wrapper, "class", "svelte-1cql8sl");
    			toggle_class(wrapper, "selected", /*selected*/ ctx[1]);
    			add_location(wrapper, file$8, 17, 0, 307);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, wrapper, anchor);
    			append_dev(wrapper, p);
    			append_dev(p, t);

    			if (!mounted) {
    				dispose = listen_dev(wrapper, "mousedown", /*clicked*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) set_data_dev(t, /*text*/ ctx[0]);

    			if (dirty & /*selected*/ 2) {
    				toggle_class(wrapper, "selected", /*selected*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(wrapper);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Answer', slots, []);
    	let { text } = $$props;
    	let { index } = $$props;
    	let { selected } = $$props;
    	const dispatch = createEventDispatcher();

    	const clicked = () => {
    		dispatch("answer:selected", { index, text });
    	};

    	const writable_props = ['text', 'index', 'selected'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Answer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('index' in $$props) $$invalidate(3, index = $$props.index);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    	};

    	$$self.$capture_state = () => ({
    		text,
    		index,
    		selected,
    		createEventDispatcher,
    		dispatch,
    		clicked
    	});

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('index' in $$props) $$invalidate(3, index = $$props.index);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, selected, clicked, index];
    }

    class Answer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { text: 0, index: 3, selected: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Answer",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<Answer> was created without expected prop 'text'");
    		}

    		if (/*index*/ ctx[3] === undefined && !('index' in props)) {
    			console.warn("<Answer> was created without expected prop 'index'");
    		}

    		if (/*selected*/ ctx[1] === undefined && !('selected' in props)) {
    			console.warn("<Answer> was created without expected prop 'selected'");
    		}
    	}

    	get text() {
    		throw new Error("<Answer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Answer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Answer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Answer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Answer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Answer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src\lib\Prompts\AnswerList.svelte generated by Svelte v3.50.1 */
    const file$7 = "src\\lib\\Prompts\\AnswerList.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (13:6) {#if index > 0}
    function create_if_block$5(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "-";
    			add_location(p, file$7, 13, 8, 310);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(13:6) {#if index > 0}",
    		ctx
    	});

    	return block;
    }

    // (11:2) {#each answers as text, index}
    function create_each_block$1(ctx) {
    	let div;
    	let t0;
    	let answer;
    	let t1;
    	let div_transition;
    	let current;
    	let if_block = /*index*/ ctx[5] > 0 && create_if_block$5(ctx);

    	answer = new Answer({
    			props: {
    				text: /*text*/ ctx[3],
    				index: /*index*/ ctx[5],
    				selected: /*selected*/ ctx[0] === /*index*/ ctx[5]
    			},
    			$$inline: true
    		});

    	answer.$on("answer:selected", /*answer_selected_handler*/ ctx[2]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			create_component(answer.$$.fragment);
    			t1 = space();
    			add_location(div, file$7, 11, 4, 214);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t0);
    			mount_component(answer, div, null);
    			append_dev(div, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const answer_changes = {};
    			if (dirty & /*answers*/ 2) answer_changes.text = /*text*/ ctx[3];
    			if (dirty & /*selected*/ 1) answer_changes.selected = /*selected*/ ctx[0] === /*index*/ ctx[5];
    			answer.$set(answer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(answer.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(
    					div,
    					fade,
    					{
    						delay: /*index*/ ctx[5] * 1250,
    						duration: 1000
    					},
    					true
    				);

    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(answer.$$.fragment, local);

    			if (!div_transition) div_transition = create_bidirectional_transition(
    				div,
    				fade,
    				{
    					delay: /*index*/ ctx[5] * 1250,
    					duration: 1000
    				},
    				false
    			);

    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			destroy_component(answer);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(11:2) {#each answers as text, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let wrapper;
    	let current;
    	let each_value = /*answers*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			wrapper = element("wrapper");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(wrapper, file$7, 9, 0, 165);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, wrapper, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(wrapper, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*answers, selected*/ 3) {
    				each_value = /*answers*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(wrapper, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(wrapper);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AnswerList', slots, []);
    	let { selected = -1 } = $$props;
    	let { answers } = $$props;
    	const writable_props = ['selected', 'answers'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AnswerList> was created with unknown prop '${key}'`);
    	});

    	const answer_selected_handler = e => {
    		$$invalidate(0, selected = e.detail.index);
    	};

    	$$self.$$set = $$props => {
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('answers' in $$props) $$invalidate(1, answers = $$props.answers);
    	};

    	$$self.$capture_state = () => ({ Answer, fade, selected, answers });

    	$$self.$inject_state = $$props => {
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('answers' in $$props) $$invalidate(1, answers = $$props.answers);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selected, answers, answer_selected_handler];
    }

    class AnswerList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { selected: 0, answers: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AnswerList",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*answers*/ ctx[1] === undefined && !('answers' in props)) {
    			console.warn("<AnswerList> was created without expected prop 'answers'");
    		}
    	}

    	get selected() {
    		throw new Error("<AnswerList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<AnswerList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get answers() {
    		throw new Error("<AnswerList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set answers(value) {
    		throw new Error("<AnswerList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\lib\Prompts\Card.svelte generated by Svelte v3.50.1 */

    const file$6 = "src\\lib\\Prompts\\Card.svelte";

    // (13:4) {#if button !== ""}
    function create_if_block$4(ctx) {
    	let button_1;

    	const block = {
    		c: function create() {
    			button_1 = element("button");
    			button_1.textContent = "Agree";
    			attr_dev(button_1, "class", "svelte-ygfl7b");
    			add_location(button_1, file$6, 13, 6, 223);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button_1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(13:4) {#if button !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let container;
    	let card;
    	let h3;
    	let t0;
    	let t1_value = /*index*/ ctx[2] + 1 + "";
    	let t1;
    	let t2;
    	let hr;
    	let t3;
    	let p;
    	let t4;
    	let t5;
    	let if_block = /*button*/ ctx[1] !== "" && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			container = element("container");
    			card = element("card");
    			h3 = element("h3");
    			t0 = text("Opinion #");
    			t1 = text(t1_value);
    			t2 = space();
    			hr = element("hr");
    			t3 = space();
    			p = element("p");
    			t4 = text(/*text*/ ctx[0]);
    			t5 = space();
    			if (if_block) if_block.c();
    			attr_dev(h3, "class", "svelte-ygfl7b");
    			add_location(h3, file$6, 8, 4, 128);
    			attr_dev(hr, "class", "svelte-ygfl7b");
    			add_location(hr, file$6, 9, 4, 163);
    			attr_dev(p, "class", "svelte-ygfl7b");
    			add_location(p, file$6, 10, 4, 175);
    			attr_dev(card, "class", "svelte-ygfl7b");
    			add_location(card, file$6, 7, 2, 116);
    			attr_dev(container, "class", "svelte-ygfl7b");
    			add_location(container, file$6, 6, 0, 101);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, container, anchor);
    			append_dev(container, card);
    			append_dev(card, h3);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    			append_dev(card, t2);
    			append_dev(card, hr);
    			append_dev(card, t3);
    			append_dev(card, p);
    			append_dev(p, t4);
    			append_dev(card, t5);
    			if (if_block) if_block.m(card, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*index*/ 4 && t1_value !== (t1_value = /*index*/ ctx[2] + 1 + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*text*/ 1) set_data_dev(t4, /*text*/ ctx[0]);

    			if (/*button*/ ctx[1] !== "") {
    				if (if_block) ; else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(card, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(container);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, []);
    	let { text = "" } = $$props;
    	let { button = "" } = $$props;
    	let { index = -1 } = $$props;
    	const writable_props = ['text', 'button', 'index'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('button' in $$props) $$invalidate(1, button = $$props.button);
    		if ('index' in $$props) $$invalidate(2, index = $$props.index);
    	};

    	$$self.$capture_state = () => ({ text, button, index });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('button' in $$props) $$invalidate(1, button = $$props.button);
    		if ('index' in $$props) $$invalidate(2, index = $$props.index);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, button, index];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { text: 0, button: 1, index: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get text() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get button() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set button(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\lib\Prompts\OpinionCard.svelte generated by Svelte v3.50.1 */

    function create_fragment$6(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				text: /*opinion*/ ctx[0].text,
    				index: /*index*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card_changes = {};
    			if (dirty & /*opinion*/ 1) card_changes.text = /*opinion*/ ctx[0].text;
    			if (dirty & /*index*/ 2) card_changes.index = /*index*/ ctx[1];
    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OpinionCard', slots, []);
    	let { opinion } = $$props;
    	let { index } = $$props;
    	const writable_props = ['opinion', 'index'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OpinionCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('opinion' in $$props) $$invalidate(0, opinion = $$props.opinion);
    		if ('index' in $$props) $$invalidate(1, index = $$props.index);
    	};

    	$$self.$capture_state = () => ({ Card, opinion, index });

    	$$self.$inject_state = $$props => {
    		if ('opinion' in $$props) $$invalidate(0, opinion = $$props.opinion);
    		if ('index' in $$props) $$invalidate(1, index = $$props.index);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [opinion, index];
    }

    class OpinionCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { opinion: 0, index: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OpinionCard",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*opinion*/ ctx[0] === undefined && !('opinion' in props)) {
    			console.warn("<OpinionCard> was created without expected prop 'opinion'");
    		}

    		if (/*index*/ ctx[1] === undefined && !('index' in props)) {
    			console.warn("<OpinionCard> was created without expected prop 'index'");
    		}
    	}

    	get opinion() {
    		throw new Error("<OpinionCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opinion(value) {
    		throw new Error("<OpinionCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<OpinionCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<OpinionCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\lib\Prompts\OpinionCards.svelte generated by Svelte v3.50.1 */
    const file$5 = "src\\lib\\Prompts\\OpinionCards.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    // (20:2) {:else}
    function create_else_block$2(ctx) {
    	let p;
    	let i;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			i = element("i");
    			i.textContent = "No opinions exist yet for this choice.";
    			add_location(i, file$5, 21, 6, 531);
    			add_location(p, file$5, 20, 4, 483);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, i);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, fade, { duration: 1000 }, true);
    				p_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!p_transition) p_transition = create_bidirectional_transition(p, fade, { duration: 1000 }, false);
    			p_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(20:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (14:32) 
    function create_if_block_1$2(ctx) {
    	let scroller;
    	let current;
    	let each_value = /*opinions*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			scroller = element("scroller");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(scroller, "class", "svelte-1piykg0");
    			add_location(scroller, file$5, 14, 4, 339);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, scroller, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(scroller, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*opinions*/ 1) {
    				each_value = /*opinions*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(scroller, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(scroller);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(14:32) ",
    		ctx
    	});

    	return block;
    }

    // (10:2) {#if opinions === null}
    function create_if_block$3(ctx) {
    	let p;
    	let i;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			i = element("i");
    			i.textContent = "Select an choice to opinions for that choice.";
    			add_location(i, file$5, 11, 6, 237);
    			add_location(p, file$5, 10, 4, 189);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, i);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, fade, { duration: 1000 }, true);
    				p_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!p_transition) p_transition = create_bidirectional_transition(p, fade, { duration: 1000 }, false);
    			p_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(10:2) {#if opinions === null}",
    		ctx
    	});

    	return block;
    }

    // (16:6) {#each opinions as opinion, index}
    function create_each_block(ctx) {
    	let opinioncard;
    	let current;

    	opinioncard = new OpinionCard({
    			props: {
    				opinion: /*opinion*/ ctx[1],
    				index: /*index*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(opinioncard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(opinioncard, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const opinioncard_changes = {};
    			if (dirty & /*opinions*/ 1) opinioncard_changes.opinion = /*opinion*/ ctx[1];
    			opinioncard.$set(opinioncard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(opinioncard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(opinioncard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(opinioncard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(16:6) {#each opinions as opinion, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let wrapper;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$3, create_if_block_1$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*opinions*/ ctx[0] === null) return 0;
    		if (/*opinions*/ ctx[0].length > 0) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			wrapper = element("wrapper");
    			if_block.c();
    			attr_dev(wrapper, "class", "svelte-1piykg0");
    			add_location(wrapper, file$5, 8, 0, 147);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, wrapper, anchor);
    			if_blocks[current_block_type_index].m(wrapper, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(wrapper, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(wrapper);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OpinionCards', slots, []);
    	let { opinions } = $$props;
    	const writable_props = ['opinions'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OpinionCards> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('opinions' in $$props) $$invalidate(0, opinions = $$props.opinions);
    	};

    	$$self.$capture_state = () => ({ OpinionCard, fade, opinions });

    	$$self.$inject_state = $$props => {
    		if ('opinions' in $$props) $$invalidate(0, opinions = $$props.opinions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [opinions];
    }

    class OpinionCards extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { opinions: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OpinionCards",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*opinions*/ ctx[0] === undefined && !('opinions' in props)) {
    			console.warn("<OpinionCards> was created without expected prop 'opinions'");
    		}
    	}

    	get opinions() {
    		throw new Error("<OpinionCards>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opinions(value) {
    		throw new Error("<OpinionCards>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-typewriter\Typewriter.svelte generated by Svelte v3.50.1 */

    const file$4 = "node_modules\\svelte-typewriter\\Typewriter.svelte";

    // (101:4) {:else}
    function create_else_block$1(ctx) {
    	let await_block_anchor;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block_1,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*delayPromise*/ ctx[6](), info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*delayPromise*/ 64 && promise !== (promise = /*delayPromise*/ ctx[6]()) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(101:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (97:4) {#if disabled}
    function create_if_block$2(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[23].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[22], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "typewriter-container svelte-12nvf3j");
    			add_location(div, file$4, 97, 8, 3044);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4194304)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[22],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[22])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[22], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(97:4) {#if disabled}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>     export let mode = "concurrent"      // general-purpose props  export let interval = 30  export let cursor = true     export let keepCursorOnFinish = false  export let delay = 0     export let showCursorOnDelay = false     export let disabled = false     export let element = "div"      // mode-specific props     export let scrambleDuration = 3000     export let scrambleSlowdown = true  export let unwriteInterval = 30     export let wordInterval = 1500      $: isLoopMode = /^loop(Once|Random)?$/.test(mode)      // these modes stop once all given elements have finished their animations     // and support the cursor     $: isFiniteCursorMode = ["concurrent", "cascade", "loopOnce"].includes(mode)      $: unnecessaryCursorOnEnd = !isFiniteCursorMode && keepCursorOnFinish     $: unnecessaryCursorOnDelay = delay < 1 && showCursorOnDelay     $: unnecessaryLoopProps = !isLoopMode && ($$props.unwriteInterval || $$props.wordInterval)     $: unnecessaryScrambleProps = mode !== "scramble" && ($$props.scrambleDuration || $$props.scrambleSlowdown)      const modes = {         concurrent: () => import("./modes/concurrent"),         cascade: () => import("./modes/cascade"),         loop: () => import("./modes/loop"),         loopOnce: () => import("./modes/loopOnce"),         loopRandom: () => import("./modes/loopRandom"),         scramble: () => import("./modes/scramble")     }
    function create_catch_block_1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block_1.name,
    		type: "catch",
    		source: "(1:0) <script>     export let mode = \\\"concurrent\\\"      // general-purpose props  export let interval = 30  export let cursor = true     export let keepCursorOnFinish = false  export let delay = 0     export let showCursorOnDelay = false     export let disabled = false     export let element = \\\"div\\\"      // mode-specific props     export let scrambleDuration = 3000     export let scrambleSlowdown = true  export let unwriteInterval = 30     export let wordInterval = 1500      $: isLoopMode = /^loop(Once|Random)?$/.test(mode)      // these modes stop once all given elements have finished their animations     // and support the cursor     $: isFiniteCursorMode = [\\\"concurrent\\\", \\\"cascade\\\", \\\"loopOnce\\\"].includes(mode)      $: unnecessaryCursorOnEnd = !isFiniteCursorMode && keepCursorOnFinish     $: unnecessaryCursorOnDelay = delay < 1 && showCursorOnDelay     $: unnecessaryLoopProps = !isLoopMode && ($$props.unwriteInterval || $$props.wordInterval)     $: unnecessaryScrambleProps = mode !== \\\"scramble\\\" && ($$props.scrambleDuration || $$props.scrambleSlowdown)      const modes = {         concurrent: () => import(\\\"./modes/concurrent\\\"),         cascade: () => import(\\\"./modes/cascade\\\"),         loop: () => import(\\\"./modes/loop\\\"),         loopOnce: () => import(\\\"./modes/loopOnce\\\"),         loopRandom: () => import(\\\"./modes/loopRandom\\\"),         scramble: () => import(\\\"./modes/scramble\\\")     }",
    		ctx
    	});

    	return block;
    }

    // (108:8) {:then}
    function create_then_block(ctx) {
    	let await_block_anchor;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block_1,
    		then: create_then_block_1,
    		catch: create_catch_block,
    		value: 24,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*modes*/ ctx[7][/*mode*/ ctx[0]](), info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*mode*/ 1 && promise !== (promise = /*modes*/ ctx[7][/*mode*/ ctx[0]]()) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(108:8) {:then}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>     export let mode = "concurrent"      // general-purpose props  export let interval = 30  export let cursor = true     export let keepCursorOnFinish = false  export let delay = 0     export let showCursorOnDelay = false     export let disabled = false     export let element = "div"      // mode-specific props     export let scrambleDuration = 3000     export let scrambleSlowdown = true  export let unwriteInterval = 30     export let wordInterval = 1500      $: isLoopMode = /^loop(Once|Random)?$/.test(mode)      // these modes stop once all given elements have finished their animations     // and support the cursor     $: isFiniteCursorMode = ["concurrent", "cascade", "loopOnce"].includes(mode)      $: unnecessaryCursorOnEnd = !isFiniteCursorMode && keepCursorOnFinish     $: unnecessaryCursorOnDelay = delay < 1 && showCursorOnDelay     $: unnecessaryLoopProps = !isLoopMode && ($$props.unwriteInterval || $$props.wordInterval)     $: unnecessaryScrambleProps = mode !== "scramble" && ($$props.scrambleDuration || $$props.scrambleSlowdown)      const modes = {         concurrent: () => import("./modes/concurrent"),         cascade: () => import("./modes/cascade"),         loop: () => import("./modes/loop"),         loopOnce: () => import("./modes/loopOnce"),         loopRandom: () => import("./modes/loopRandom"),         scramble: () => import("./modes/scramble")     }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>     export let mode = \\\"concurrent\\\"      // general-purpose props  export let interval = 30  export let cursor = true     export let keepCursorOnFinish = false  export let delay = 0     export let showCursorOnDelay = false     export let disabled = false     export let element = \\\"div\\\"      // mode-specific props     export let scrambleDuration = 3000     export let scrambleSlowdown = true  export let unwriteInterval = 30     export let wordInterval = 1500      $: isLoopMode = /^loop(Once|Random)?$/.test(mode)      // these modes stop once all given elements have finished their animations     // and support the cursor     $: isFiniteCursorMode = [\\\"concurrent\\\", \\\"cascade\\\", \\\"loopOnce\\\"].includes(mode)      $: unnecessaryCursorOnEnd = !isFiniteCursorMode && keepCursorOnFinish     $: unnecessaryCursorOnDelay = delay < 1 && showCursorOnDelay     $: unnecessaryLoopProps = !isLoopMode && ($$props.unwriteInterval || $$props.wordInterval)     $: unnecessaryScrambleProps = mode !== \\\"scramble\\\" && ($$props.scrambleDuration || $$props.scrambleSlowdown)      const modes = {         concurrent: () => import(\\\"./modes/concurrent\\\"),         cascade: () => import(\\\"./modes/cascade\\\"),         loop: () => import(\\\"./modes/loop\\\"),         loopOnce: () => import(\\\"./modes/loopOnce\\\"),         loopRandom: () => import(\\\"./modes/loopRandom\\\"),         scramble: () => import(\\\"./modes/scramble\\\")     }",
    		ctx
    	});

    	return block;
    }

    // (109:52)                  <svelte:element this={element}
    function create_then_block_1(ctx) {
    	let previous_tag = /*element*/ ctx[4];
    	let svelte_element_anchor;
    	let current;
    	validate_dynamic_element(/*element*/ ctx[4]);
    	validate_void_dynamic_element(/*element*/ ctx[4]);
    	let svelte_element = /*element*/ ctx[4] && create_dynamic_element(ctx);

    	const block = {
    		c: function create() {
    			if (svelte_element) svelte_element.c();
    			svelte_element_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (svelte_element) svelte_element.m(target, anchor);
    			insert_dev(target, svelte_element_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*element*/ ctx[4]) {
    				if (!previous_tag) {
    					svelte_element = create_dynamic_element(ctx);
    					svelte_element.c();
    					svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
    				} else if (safe_not_equal(previous_tag, /*element*/ ctx[4])) {
    					svelte_element.d(1);
    					validate_dynamic_element(/*element*/ ctx[4]);
    					validate_void_dynamic_element(/*element*/ ctx[4]);
    					svelte_element = create_dynamic_element(ctx);
    					svelte_element.c();
    					svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
    				} else {
    					svelte_element.p(ctx, dirty);
    				}
    			} else if (previous_tag) {
    				svelte_element.d(1);
    				svelte_element = null;
    			}

    			previous_tag = /*element*/ ctx[4];
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svelte_element);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svelte_element);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_element_anchor);
    			if (svelte_element) svelte_element.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block_1.name,
    		type: "then",
    		source: "(109:52)                  <svelte:element this={element}",
    		ctx
    	});

    	return block;
    }

    // (110:16) <svelte:element this={element} use:selectedMode.default={props} class:cursor class="typewriter-container">
    function create_dynamic_element(ctx) {
    	let svelte_element;
    	let selectedMode_default_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[23].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[22], null);

    	let svelte_element_levels = [
    		{
    			class: "typewriter-container svelte-12nvf3j"
    		}
    	];

    	let svelte_element_data = {};

    	for (let i = 0; i < svelte_element_levels.length; i += 1) {
    		svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svelte_element = element(/*element*/ ctx[4]);
    			if (default_slot) default_slot.c();
    			set_attributes(svelte_element, svelte_element_data);
    			toggle_class(svelte_element, "cursor", /*cursor*/ ctx[1]);
    			add_location(svelte_element, file$4, 109, 16, 3422);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svelte_element, anchor);

    			if (default_slot) {
    				default_slot.m(svelte_element, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(selectedMode_default_action = /*selectedMode*/ ctx[24].default(svelte_element, /*props*/ ctx[5]));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4194304)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[22],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[22])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[22], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [
    				{
    					class: "typewriter-container svelte-12nvf3j"
    				}
    			]));

    			if (selectedMode_default_action && is_function(selectedMode_default_action.update) && dirty & /*props*/ 32) selectedMode_default_action.update.call(null, /*props*/ ctx[5]);
    			toggle_class(svelte_element, "cursor", /*cursor*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_element);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_dynamic_element.name,
    		type: "child_dynamic_element",
    		source: "(110:16) <svelte:element this={element} use:selectedMode.default={props} class:cursor class=\\\"typewriter-container\\\">",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>     export let mode = "concurrent"      // general-purpose props  export let interval = 30  export let cursor = true     export let keepCursorOnFinish = false  export let delay = 0     export let showCursorOnDelay = false     export let disabled = false     export let element = "div"      // mode-specific props     export let scrambleDuration = 3000     export let scrambleSlowdown = true  export let unwriteInterval = 30     export let wordInterval = 1500      $: isLoopMode = /^loop(Once|Random)?$/.test(mode)      // these modes stop once all given elements have finished their animations     // and support the cursor     $: isFiniteCursorMode = ["concurrent", "cascade", "loopOnce"].includes(mode)      $: unnecessaryCursorOnEnd = !isFiniteCursorMode && keepCursorOnFinish     $: unnecessaryCursorOnDelay = delay < 1 && showCursorOnDelay     $: unnecessaryLoopProps = !isLoopMode && ($$props.unwriteInterval || $$props.wordInterval)     $: unnecessaryScrambleProps = mode !== "scramble" && ($$props.scrambleDuration || $$props.scrambleSlowdown)      const modes = {         concurrent: () => import("./modes/concurrent"),         cascade: () => import("./modes/cascade"),         loop: () => import("./modes/loop"),         loopOnce: () => import("./modes/loopOnce"),         loopRandom: () => import("./modes/loopRandom"),         scramble: () => import("./modes/scramble")     }
    function create_pending_block_1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block_1.name,
    		type: "pending",
    		source: "(1:0) <script>     export let mode = \\\"concurrent\\\"      // general-purpose props  export let interval = 30  export let cursor = true     export let keepCursorOnFinish = false  export let delay = 0     export let showCursorOnDelay = false     export let disabled = false     export let element = \\\"div\\\"      // mode-specific props     export let scrambleDuration = 3000     export let scrambleSlowdown = true  export let unwriteInterval = 30     export let wordInterval = 1500      $: isLoopMode = /^loop(Once|Random)?$/.test(mode)      // these modes stop once all given elements have finished their animations     // and support the cursor     $: isFiniteCursorMode = [\\\"concurrent\\\", \\\"cascade\\\", \\\"loopOnce\\\"].includes(mode)      $: unnecessaryCursorOnEnd = !isFiniteCursorMode && keepCursorOnFinish     $: unnecessaryCursorOnDelay = delay < 1 && showCursorOnDelay     $: unnecessaryLoopProps = !isLoopMode && ($$props.unwriteInterval || $$props.wordInterval)     $: unnecessaryScrambleProps = mode !== \\\"scramble\\\" && ($$props.scrambleDuration || $$props.scrambleSlowdown)      const modes = {         concurrent: () => import(\\\"./modes/concurrent\\\"),         cascade: () => import(\\\"./modes/cascade\\\"),         loop: () => import(\\\"./modes/loop\\\"),         loopOnce: () => import(\\\"./modes/loopOnce\\\"),         loopRandom: () => import(\\\"./modes/loopRandom\\\"),         scramble: () => import(\\\"./modes/scramble\\\")     }",
    		ctx
    	});

    	return block;
    }

    // (102:31)              {#if showCursorOnDelay}
    function create_pending_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*showCursorOnDelay*/ ctx[2] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*showCursorOnDelay*/ ctx[2]) {
    				if (if_block) ; else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(102:31)              {#if showCursorOnDelay}",
    		ctx
    	});

    	return block;
    }

    // (103:12) {#if showCursorOnDelay}
    function create_if_block_1$1(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			attr_dev(p, "class", "typing");
    			add_location(p, file$4, 104, 20, 3273);
    			attr_dev(div, "class", "typewriter-container cursor svelte-12nvf3j");
    			add_location(div, file$4, 103, 16, 3211);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(103:12) {#if showCursorOnDelay}",
    		ctx
    	});

    	return block;
    }

    // (96:0) {#key $$props}
    function create_key_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*disabled*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(96:0) {#key $$props}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let t;
    	let previous_key = /*$$props*/ ctx[8];
    	let key_block_anchor;
    	let current;
    	let key_block = create_key_block(ctx);

    	const block = {
    		c: function create() {
    			t = space();
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 256 && safe_not_equal(previous_key, previous_key = /*$$props*/ ctx[8])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block, 1);
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let isLoopMode;
    	let isFiniteCursorMode;
    	let unnecessaryCursorOnEnd;
    	let unnecessaryCursorOnDelay;
    	let unnecessaryLoopProps;
    	let unnecessaryScrambleProps;
    	let delayPromise;
    	let props;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Typewriter', slots, ['default']);
    	let { mode = "concurrent" } = $$props;
    	let { interval = 30 } = $$props;
    	let { cursor = true } = $$props;
    	let { keepCursorOnFinish = false } = $$props;
    	let { delay = 0 } = $$props;
    	let { showCursorOnDelay = false } = $$props;
    	let { disabled = false } = $$props;
    	let { element = "div" } = $$props;
    	let { scrambleDuration = 3000 } = $$props;
    	let { scrambleSlowdown = true } = $$props;
    	let { unwriteInterval = 30 } = $$props;
    	let { wordInterval = 1500 } = $$props;

    	const modes = {
    		concurrent: () => Promise.resolve().then(function () { return concurrent$1; }),
    		cascade: () => Promise.resolve().then(function () { return cascade$1; }),
    		loop: () => Promise.resolve().then(function () { return loop$1; }),
    		loopOnce: () => Promise.resolve().then(function () { return loopOnce$1; }),
    		loopRandom: () => Promise.resolve().then(function () { return loopRandom$1; }),
    		scramble: () => Promise.resolve().then(function () { return scramble$1; })
    	};

    	$$self.$$set = $$new_props => {
    		$$invalidate(8, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('mode' in $$new_props) $$invalidate(0, mode = $$new_props.mode);
    		if ('interval' in $$new_props) $$invalidate(9, interval = $$new_props.interval);
    		if ('cursor' in $$new_props) $$invalidate(1, cursor = $$new_props.cursor);
    		if ('keepCursorOnFinish' in $$new_props) $$invalidate(10, keepCursorOnFinish = $$new_props.keepCursorOnFinish);
    		if ('delay' in $$new_props) $$invalidate(11, delay = $$new_props.delay);
    		if ('showCursorOnDelay' in $$new_props) $$invalidate(2, showCursorOnDelay = $$new_props.showCursorOnDelay);
    		if ('disabled' in $$new_props) $$invalidate(3, disabled = $$new_props.disabled);
    		if ('element' in $$new_props) $$invalidate(4, element = $$new_props.element);
    		if ('scrambleDuration' in $$new_props) $$invalidate(12, scrambleDuration = $$new_props.scrambleDuration);
    		if ('scrambleSlowdown' in $$new_props) $$invalidate(13, scrambleSlowdown = $$new_props.scrambleSlowdown);
    		if ('unwriteInterval' in $$new_props) $$invalidate(14, unwriteInterval = $$new_props.unwriteInterval);
    		if ('wordInterval' in $$new_props) $$invalidate(15, wordInterval = $$new_props.wordInterval);
    		if ('$$scope' in $$new_props) $$invalidate(22, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		mode,
    		interval,
    		cursor,
    		keepCursorOnFinish,
    		delay,
    		showCursorOnDelay,
    		disabled,
    		element,
    		scrambleDuration,
    		scrambleSlowdown,
    		unwriteInterval,
    		wordInterval,
    		modes,
    		props,
    		delayPromise,
    		unnecessaryScrambleProps,
    		unnecessaryLoopProps,
    		unnecessaryCursorOnDelay,
    		unnecessaryCursorOnEnd,
    		isLoopMode,
    		isFiniteCursorMode
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(8, $$props = assign(assign({}, $$props), $$new_props));
    		if ('mode' in $$props) $$invalidate(0, mode = $$new_props.mode);
    		if ('interval' in $$props) $$invalidate(9, interval = $$new_props.interval);
    		if ('cursor' in $$props) $$invalidate(1, cursor = $$new_props.cursor);
    		if ('keepCursorOnFinish' in $$props) $$invalidate(10, keepCursorOnFinish = $$new_props.keepCursorOnFinish);
    		if ('delay' in $$props) $$invalidate(11, delay = $$new_props.delay);
    		if ('showCursorOnDelay' in $$props) $$invalidate(2, showCursorOnDelay = $$new_props.showCursorOnDelay);
    		if ('disabled' in $$props) $$invalidate(3, disabled = $$new_props.disabled);
    		if ('element' in $$props) $$invalidate(4, element = $$new_props.element);
    		if ('scrambleDuration' in $$props) $$invalidate(12, scrambleDuration = $$new_props.scrambleDuration);
    		if ('scrambleSlowdown' in $$props) $$invalidate(13, scrambleSlowdown = $$new_props.scrambleSlowdown);
    		if ('unwriteInterval' in $$props) $$invalidate(14, unwriteInterval = $$new_props.unwriteInterval);
    		if ('wordInterval' in $$props) $$invalidate(15, wordInterval = $$new_props.wordInterval);
    		if ('props' in $$props) $$invalidate(5, props = $$new_props.props);
    		if ('delayPromise' in $$props) $$invalidate(6, delayPromise = $$new_props.delayPromise);
    		if ('unnecessaryScrambleProps' in $$props) $$invalidate(16, unnecessaryScrambleProps = $$new_props.unnecessaryScrambleProps);
    		if ('unnecessaryLoopProps' in $$props) $$invalidate(17, unnecessaryLoopProps = $$new_props.unnecessaryLoopProps);
    		if ('unnecessaryCursorOnDelay' in $$props) $$invalidate(18, unnecessaryCursorOnDelay = $$new_props.unnecessaryCursorOnDelay);
    		if ('unnecessaryCursorOnEnd' in $$props) $$invalidate(19, unnecessaryCursorOnEnd = $$new_props.unnecessaryCursorOnEnd);
    		if ('isLoopMode' in $$props) $$invalidate(20, isLoopMode = $$new_props.isLoopMode);
    		if ('isFiniteCursorMode' in $$props) $$invalidate(21, isFiniteCursorMode = $$new_props.isFiniteCursorMode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*mode*/ 1) {
    			$$invalidate(20, isLoopMode = (/^loop(Once|Random)?$/).test(mode));
    		}

    		if ($$self.$$.dirty & /*mode*/ 1) {
    			// these modes stop once all given elements have finished their animations
    			// and support the cursor
    			$$invalidate(21, isFiniteCursorMode = ["concurrent", "cascade", "loopOnce"].includes(mode));
    		}

    		if ($$self.$$.dirty & /*isFiniteCursorMode, keepCursorOnFinish*/ 2098176) {
    			$$invalidate(19, unnecessaryCursorOnEnd = !isFiniteCursorMode && keepCursorOnFinish);
    		}

    		if ($$self.$$.dirty & /*delay, showCursorOnDelay*/ 2052) {
    			$$invalidate(18, unnecessaryCursorOnDelay = delay < 1 && showCursorOnDelay);
    		}

    		$$invalidate(17, unnecessaryLoopProps = !isLoopMode && ($$props.unwriteInterval || $$props.wordInterval));
    		$$invalidate(16, unnecessaryScrambleProps = mode !== "scramble" && ($$props.scrambleDuration || $$props.scrambleSlowdown));

    		if ($$self.$$.dirty & /*unnecessaryCursorOnEnd*/ 524288) {
    			unnecessaryCursorOnEnd && console.warn("[svelte-typewriter] The prop 'keepCursorOnFinish' only has effect on the following modes: 'concurrent', 'cascade' and 'loopOnce'");
    		}

    		if ($$self.$$.dirty & /*unnecessaryCursorOnDelay*/ 262144) {
    			unnecessaryCursorOnDelay && console.warn("[svelte-typewriter] The prop 'showCursorOnDelay' has no effect if the delay is 0");
    		}

    		if ($$self.$$.dirty & /*unnecessaryLoopProps*/ 131072) {
    			unnecessaryLoopProps && console.warn("[svelte-typewriter] The props 'unwriteInterval' and 'wordInterval' can only be used on loop mode");
    		}

    		if ($$self.$$.dirty & /*unnecessaryScrambleProps*/ 65536) {
    			unnecessaryScrambleProps && console.warn("[svelte-typewriter] The props 'scrambleDuration' and 'scrambleSlowdown' can only be used on scramble mode");
    		}

    		if ($$self.$$.dirty & /*delay*/ 2048) {
    			$$invalidate(6, delayPromise = () => new Promise(resolve => setTimeout(() => resolve(delay), delay)));
    		}

    		if ($$self.$$.dirty & /*interval, cursor, keepCursorOnFinish, delay, showCursorOnDelay, disabled, element, scrambleDuration, scrambleSlowdown, unwriteInterval, wordInterval*/ 65054) {
    			$$invalidate(5, props = {
    				interval,
    				cursor,
    				keepCursorOnFinish,
    				delay,
    				showCursorOnDelay,
    				disabled,
    				element,
    				scrambleDuration,
    				scrambleSlowdown,
    				unwriteInterval,
    				wordInterval
    			});
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		mode,
    		cursor,
    		showCursorOnDelay,
    		disabled,
    		element,
    		props,
    		delayPromise,
    		modes,
    		$$props,
    		interval,
    		keepCursorOnFinish,
    		delay,
    		scrambleDuration,
    		scrambleSlowdown,
    		unwriteInterval,
    		wordInterval,
    		unnecessaryScrambleProps,
    		unnecessaryLoopProps,
    		unnecessaryCursorOnDelay,
    		unnecessaryCursorOnEnd,
    		isLoopMode,
    		isFiniteCursorMode,
    		$$scope,
    		slots
    	];
    }

    class Typewriter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			mode: 0,
    			interval: 9,
    			cursor: 1,
    			keepCursorOnFinish: 10,
    			delay: 11,
    			showCursorOnDelay: 2,
    			disabled: 3,
    			element: 4,
    			scrambleDuration: 12,
    			scrambleSlowdown: 13,
    			unwriteInterval: 14,
    			wordInterval: 15
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Typewriter",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get mode() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mode(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get interval() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set interval(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cursor() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cursor(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get keepCursorOnFinish() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keepCursorOnFinish(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get delay() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set delay(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showCursorOnDelay() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showCursorOnDelay(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrambleDuration() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrambleDuration(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrambleSlowdown() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrambleSlowdown(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unwriteInterval() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unwriteInterval(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get wordInterval() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wordInterval(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\lib\Prompts\Intro.svelte generated by Svelte v3.50.1 */
    const file$3 = "src\\lib\\Prompts\\Intro.svelte";

    // (9:0) <Typewriter mode="cascade" keepCursorOnFinish={true} on:done={() => {}}>
    function create_default_slot$1(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*text*/ ctx[0]);
    			add_location(p, file$3, 9, 2, 215);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 1) set_data_dev(t, /*text*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(9:0) <Typewriter mode=\\\"cascade\\\" keepCursorOnFinish={true} on:done={() => {}}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let typewriter;
    	let t0;
    	let button;
    	let button_transition;
    	let current;

    	typewriter = new Typewriter({
    			props: {
    				mode: "cascade",
    				keepCursorOnFinish: true,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	typewriter.$on("done", done_handler);

    	const block = {
    		c: function create() {
    			create_component(typewriter.$$.fragment);
    			t0 = space();
    			button = element("button");
    			button.textContent = "Continue ▶";
    			attr_dev(button, "class", "svelte-rjeg32");
    			add_location(button, file$3, 12, 0, 247);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(typewriter, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const typewriter_changes = {};

    			if (dirty & /*$$scope, text*/ 3) {
    				typewriter_changes.$$scope = { dirty, ctx };
    			}

    			typewriter.$set(typewriter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(typewriter.$$.fragment, local);

    			add_render_callback(() => {
    				if (!button_transition) button_transition = create_bidirectional_transition(button, fade, { delay: 0, duration: 1000 }, true);
    				button_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(typewriter.$$.fragment, local);
    			if (!button_transition) button_transition = create_bidirectional_transition(button, fade, { delay: 0, duration: 1000 }, false);
    			button_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(typewriter, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			if (detaching && button_transition) button_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const done_handler = () => {
    	
    };

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Intro', slots, []);
    	let { text } = $$props;
    	const writable_props = ['text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Intro> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ Typewriter, fade, text });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text];
    }

    class Intro extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Intro",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<Intro> was created without expected prop 'text'");
    		}
    	}

    	get text() {
    		throw new Error("<Intro>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Intro>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\lib\Prompts\Prompt.svelte generated by Svelte v3.50.1 */
    const file$2 = "src\\lib\\Prompts\\Prompt.svelte";

    // (20:2) <Typewriter      mode="concurrent"      on:done={() => {        answersVisible = true;      }}    >
    function create_default_slot(ctx) {
    	let question;
    	let current;

    	question = new Question({
    			props: { text: /*prompt*/ ctx[0].question },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(question.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(question, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const question_changes = {};
    			if (dirty & /*prompt*/ 1) question_changes.text = /*prompt*/ ctx[0].question;
    			question.$set(question_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(question.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(question.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(question, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(20:2) <Typewriter      mode=\\\"concurrent\\\"      on:done={() => {        answersVisible = true;      }}    >",
    		ctx
    	});

    	return block;
    }

    // (29:2) {#if answersVisible}
    function create_if_block$1(ctx) {
    	let answerlist;
    	let updating_selected;
    	let t0;
    	let t1;
    	let if_block1_anchor;
    	let current;

    	function answerlist_selected_binding(value) {
    		/*answerlist_selected_binding*/ ctx[5](value);
    	}

    	let answerlist_props = { answers: /*prompt*/ ctx[0].answers };

    	if (/*selected*/ ctx[3] !== void 0) {
    		answerlist_props.selected = /*selected*/ ctx[3];
    	}

    	answerlist = new AnswerList({ props: answerlist_props, $$inline: true });
    	binding_callbacks.push(() => bind(answerlist, 'selected', answerlist_selected_binding));
    	let if_block0 = /*prompt*/ ctx[0].canHaveOpinion && create_if_block_2(ctx);
    	let if_block1 = /*selected*/ ctx[3] !== -1 && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			create_component(answerlist.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(answerlist, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const answerlist_changes = {};
    			if (dirty & /*prompt*/ 1) answerlist_changes.answers = /*prompt*/ ctx[0].answers;

    			if (!updating_selected && dirty & /*selected*/ 8) {
    				updating_selected = true;
    				answerlist_changes.selected = /*selected*/ ctx[3];
    				add_flush_callback(() => updating_selected = false);
    			}

    			answerlist.$set(answerlist_changes);

    			if (/*prompt*/ ctx[0].canHaveOpinion) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*prompt*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*selected*/ ctx[3] !== -1) {
    				if (if_block1) {
    					if (dirty & /*selected*/ 8) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(answerlist.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(answerlist.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(answerlist, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(29:2) {#if answersVisible}",
    		ctx
    	});

    	return block;
    }

    // (32:4) {#if prompt.canHaveOpinion}
    function create_if_block_2(ctx) {
    	let opinioncards;
    	let current;

    	opinioncards = new OpinionCards({
    			props: {
    				opinions: /*selected*/ ctx[3] >= 0
    				? /*opinions*/ ctx[1].filter(/*func*/ ctx[6])
    				: null
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(opinioncards.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(opinioncards, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const opinioncards_changes = {};

    			if (dirty & /*selected, opinions*/ 10) opinioncards_changes.opinions = /*selected*/ ctx[3] >= 0
    			? /*opinions*/ ctx[1].filter(/*func*/ ctx[6])
    			: null;

    			opinioncards.$set(opinioncards_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(opinioncards.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(opinioncards.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(opinioncards, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(32:4) {#if prompt.canHaveOpinion}",
    		ctx
    	});

    	return block;
    }

    // (42:4) {#if selected !== -1}
    function create_if_block_1(ctx) {
    	let button;
    	let button_transition;
    	let current;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Choose ▶";
    			attr_dev(button, "class", "svelte-z6fwxr");
    			add_location(button, file$2, 42, 6, 930);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!button_transition) button_transition = create_bidirectional_transition(button, fade, { delay: 0, duration: 1000 }, true);
    				button_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!button_transition) button_transition = create_bidirectional_transition(button, fade, { delay: 0, duration: 1000 }, false);
    			button_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching && button_transition) button_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(42:4) {#if selected !== -1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let wrapper;
    	let typewriter;
    	let t;
    	let current;

    	typewriter = new Typewriter({
    			props: {
    				mode: "concurrent",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	typewriter.$on("done", /*done_handler*/ ctx[4]);
    	let if_block = /*answersVisible*/ ctx[2] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			wrapper = element("wrapper");
    			create_component(typewriter.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(wrapper, "class", "svelte-z6fwxr");
    			add_location(wrapper, file$2, 18, 0, 410);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, wrapper, anchor);
    			mount_component(typewriter, wrapper, null);
    			append_dev(wrapper, t);
    			if (if_block) if_block.m(wrapper, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const typewriter_changes = {};

    			if (dirty & /*$$scope, prompt*/ 129) {
    				typewriter_changes.$$scope = { dirty, ctx };
    			}

    			typewriter.$set(typewriter_changes);

    			if (/*answersVisible*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*answersVisible*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(wrapper, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(typewriter.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(typewriter.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(wrapper);
    			destroy_component(typewriter);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Prompt', slots, []);
    	let { prompt } = $$props;
    	let { opinions } = $$props;
    	let answersVisible = false;
    	let selected = -1;
    	const writable_props = ['prompt', 'opinions'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Prompt> was created with unknown prop '${key}'`);
    	});

    	const done_handler = () => {
    		$$invalidate(2, answersVisible = true);
    	};

    	function answerlist_selected_binding(value) {
    		selected = value;
    		$$invalidate(3, selected);
    	}

    	const func = o => {
    		return o.answer === selected;
    	};

    	$$self.$$set = $$props => {
    		if ('prompt' in $$props) $$invalidate(0, prompt = $$props.prompt);
    		if ('opinions' in $$props) $$invalidate(1, opinions = $$props.opinions);
    	};

    	$$self.$capture_state = () => ({
    		Question,
    		AnswerList,
    		OpinionCards,
    		Typewriter,
    		fade,
    		Intro,
    		prompt,
    		opinions,
    		answersVisible,
    		selected
    	});

    	$$self.$inject_state = $$props => {
    		if ('prompt' in $$props) $$invalidate(0, prompt = $$props.prompt);
    		if ('opinions' in $$props) $$invalidate(1, opinions = $$props.opinions);
    		if ('answersVisible' in $$props) $$invalidate(2, answersVisible = $$props.answersVisible);
    		if ('selected' in $$props) $$invalidate(3, selected = $$props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		prompt,
    		opinions,
    		answersVisible,
    		selected,
    		done_handler,
    		answerlist_selected_binding,
    		func
    	];
    }

    class Prompt extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { prompt: 0, opinions: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Prompt",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*prompt*/ ctx[0] === undefined && !('prompt' in props)) {
    			console.warn("<Prompt> was created without expected prop 'prompt'");
    		}

    		if (/*opinions*/ ctx[1] === undefined && !('opinions' in props)) {
    			console.warn("<Prompt> was created without expected prop 'opinions'");
    		}
    	}

    	get prompt() {
    		throw new Error("<Prompt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prompt(value) {
    		throw new Error("<Prompt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get opinions() {
    		throw new Error("<Prompt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opinions(value) {
    		throw new Error("<Prompt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var name$1 = "suggestive-storytelling";
    var version = "0.1.0";
    var scripts = {
    	build: "rollup -c",
    	dev: "rollup -c -w",
    	start: "sirv public --no-clear",
    	check: "svelte-check --tsconfig ./tsconfig.json"
    };
    var devDependencies = {
    	"@rollup/plugin-commonjs": "^17.0.0",
    	"@rollup/plugin-json": "^4.1.0",
    	"@rollup/plugin-node-resolve": "^11.0.0",
    	"@rollup/plugin-typescript": "^8.0.0",
    	"@tsconfig/svelte": "^2.0.0",
    	rollup: "^2.3.4",
    	"rollup-plugin-css-only": "^3.1.0",
    	"rollup-plugin-livereload": "^2.0.0",
    	"rollup-plugin-string": "^3.0.0",
    	"rollup-plugin-svelte": "^7.0.0",
    	"rollup-plugin-terser": "^7.0.0",
    	svelte: "^3.0.0",
    	"svelte-check": "^2.0.0",
    	"svelte-preprocess": "^4.0.0",
    	"svelte-typewriter": "^3.0.4",
    	tslib: "^2.0.0",
    	typescript: "^4.0.0"
    };
    var dependencies = {
    	inkjs: "^2.1.0",
    	"sirv-cli": "^2.0.0",
    	"svelte-awesome": "^3.0.0"
    };
    var pkg = {
    	name: name$1,
    	version: version,
    	"private": true,
    	scripts: scripts,
    	devDependencies: devDependencies,
    	dependencies: dependencies
    };

    /* src\lib\Footer.svelte generated by Svelte v3.50.1 */
    const file$1 = "src\\lib\\Footer.svelte";

    function create_fragment$1(ctx) {
    	let footer;
    	let p;
    	let version;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			p = element("p");
    			version = element("version");
    			version.textContent = `v${pkg.version}`;
    			attr_dev(version, "class", "svelte-ozxhzk");
    			add_location(version, file$1, 6, 4, 85);
    			add_location(p, file$1, 5, 2, 76);
    			attr_dev(footer, "class", "svelte-ozxhzk");
    			add_location(footer, file$1, 4, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, p);
    			append_dev(p, version);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ pkg });
    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var inkFull = createCommonjsModule(function (module, exports) {
    !function(t,e){e(exports);}(commonjsGlobal,(function(t){function e(t){return (e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r);}}function i(t,e,n){return e&&r(t.prototype,e),n&&r(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function a(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&s(t,e);}function o(t){return (o=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function s(t,e){return (s=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function l(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}function u(t,e,n){return (u=l()?Reflect.construct:function(t,e,n){var r=[null];r.push.apply(r,e);var i=new(Function.bind.apply(t,r));return n&&s(i,n.prototype),i}).apply(null,arguments)}function c(t){var e="function"==typeof Map?new Map:void 0;return (c=function(t){if(null===t||(n=t,-1===Function.toString.call(n).indexOf("[native code]")))return t;var n;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,r);}function r(){return u(t,arguments,o(this).constructor)}return r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),s(r,t)})(t)}function h(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function f(t,e){if(e&&("object"==typeof e||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return h(t)}function d(t){var e=l();return function(){var n,r=o(t);if(e){var i=o(this).constructor;n=Reflect.construct(r,arguments,i);}else n=r.apply(this,arguments);return f(this,n)}}function v(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=o(t)););return t}function p(){return (p="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var r=v(t,e);if(r){var i=Object.getOwnPropertyDescriptor(r,e);return i.get?i.get.call(arguments.length<3?t:n):i.value}}).apply(this,arguments)}function m(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null==n)return;var r,i,a=[],o=!0,s=!1;try{for(n=n.call(t);!(o=(r=n.next()).done)&&(a.push(r.value),!e||a.length!==e);o=!0);}catch(t){s=!0,i=t;}finally{try{o||null==n.return||n.return();}finally{if(s)throw i}}return a}(t,e)||g(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function y(t){return function(t){if(Array.isArray(t))return C(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||g(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function g(t,e){if(t){if("string"==typeof t)return C(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return "Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?C(t,e):void 0}}function C(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function S(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=g(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,i=function(){};return {s:i,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,o=!0,s=!1;return {s:function(){n=n.call(t);},n:function(){var t=n.next();return o=t.done,t},e:function(t){s=!0,a=t;},f:function(){try{o||null==n.return||n.return();}finally{if(s)throw a}}}}var b,w=i((function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],i=arguments.length>2&&void 0!==arguments[2]&&arguments[2],a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:null;n(this,t),this.sourceFilename=e,this.pluginNames=r,this.countAllVisits=i,this.errorHandler=a,this.fileHandler=o;})),k=i((function t(e,r,i){n(this,t),this.length=e,this.debugMetadata=r,this.text=i;}));!function(t){t[t.Author=0]="Author",t[t.Warning=1]="Warning",t[t.Error=2]="Error";}(b||(b={}));var E=i((function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;n(this,t),this.identifier=e,this.isByReference=r,this.isDivertTarget=i;}));function _(t,e){return t instanceof e?N(t):null}function A(t,e){if(t instanceof e)return N(t);throw new Error("".concat(t," is not of type ").concat(e))}function T(t){return t.hasValidName&&t.name?t:null}function P(t){return void 0===t?null:t}function x(t){return "object"===e(t)&&"function"==typeof t.Equals}function N(t,e){return t}function O(t){return null!=t}var I,W=function(){function t(){var e=this;n(this,t),this._alreadyHadError=!1,this._alreadyHadWarning=!1,this._debugMetadata=null,this._runtimeObject=null,this.content=[],this.parent=null,this.GetType=function(){return e.typeName},this.AddContent=function(t){null===e.content&&(e.content=[]);var n,r=S(Array.isArray(t)?t:[t]);try{for(r.s();!(n=r.n()).done;){var i=n.value;i.hasOwnProperty("parent")&&(i.parent=e),e.content.push(i);}}catch(t){r.e(t);}finally{r.f();}return Array.isArray(t)?void 0:t},this.InsertContent=function(t,n){return null===e.content&&(e.content=[]),n.parent=e,e.content.splice(t,0,n),n},this.Find=function(t){return function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,r=_(e,t);if(null!==r&&(null===n||!0===n(r)))return r;if(null===e.content)return null;var i,a=S(e.content);try{for(a.s();!(i=a.n()).done;){var o=i.value,s=o.Find&&o.Find(t)(n);if(s)return s}}catch(t){a.e(t);}finally{a.f();}return null}},this.FindAll=function(t){return function(n,r){var i=Array.isArray(r)?r:[],a=_(e,t);if(null===a||n&&!0!==n(a)||i.push(a),null===e.content)return [];var o,s=S(e.content);try{for(s.s();!(o=s.n()).done;){var l=o.value;l.FindAll&&l.FindAll(t)(n,i);}}catch(t){s.e(t);}finally{s.f();}return i}},this.Warning=function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;e.Error(t,n,!0);};}return i(t,[{key:"debugMetadata",get:function(){return null===this._debugMetadata&&this.parent?this.parent.debugMetadata:this._debugMetadata},set:function(t){this._debugMetadata=t;}},{key:"hasOwnDebugMetadata",get:function(){return Boolean(this.debugMetadata)}},{key:"typeName",get:function(){return "ParsedObject"}},{key:"story",get:function(){for(var t=this;t.parent;)t=t.parent;return t}},{key:"runtimeObject",get:function(){return this._runtimeObject||(this._runtimeObject=this.GenerateRuntimeObject(),this._runtimeObject&&(this._runtimeObject.debugMetadata=this.debugMetadata)),this._runtimeObject},set:function(t){this._runtimeObject=t;}},{key:"runtimePath",get:function(){if(!this.runtimeObject.path)throw new Error;return this.runtimeObject.path}},{key:"containerForCounting",get:function(){return this.runtimeObject}},{key:"ancestry",get:function(){for(var t=[],e=this.parent;e;)t.push(e),e=e.parent;return t=t.reverse()}},{key:"ResolveReferences",value:function(t){if(null!==this.content){var e,n=S(this.content);try{for(n.s();!(e=n.n()).done;){e.value.ResolveReferences(t);}}catch(t){n.e(t);}finally{n.f();}}}},{key:"Error",value:function(t){function e(e){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}((function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(null===e&&(e=this),!(e._alreadyHadError&&!n||e._alreadyHadWarning&&n)){if(!this.parent)throw new Error("No parent object to send error to: ".concat(t));this.parent.Error(t,e,n),n?e._alreadyHadWarning=!0:e._alreadyHadError=!0;}}))}]),t}(),F=function(t){a(r,t);var e=d(r);function r(t){var i;return n(this,r),(i=e.call(this)).warningMessage=t,i.GenerateRuntimeObject=function(){return i.Warning(i.warningMessage),null},i}return i(r,[{key:"typeName",get:function(){return "AuthorWarning"}}]),r}(W),R=function(){function t(){if(n(this,t),this._components=[],this._componentsString=null,this._isRelative=!1,"string"==typeof arguments[0]){var e=arguments[0];this.componentsString=e;}else if(arguments[0]instanceof t.Component&&arguments[1]instanceof t){var r=arguments[0],i=arguments[1];this._components.push(r),this._components=this._components.concat(i._components);}else if(arguments[0]instanceof Array){var a=arguments[0],o=!!arguments[1];this._components=this._components.concat(a),this._isRelative=o;}}return i(t,[{key:"isRelative",get:function(){return this._isRelative}},{key:"componentCount",get:function(){return this._components.length}},{key:"head",get:function(){return this._components.length>0?this._components[0]:null}},{key:"tail",get:function(){return this._components.length>=2?new t(this._components.slice(1,this._components.length)):t.self}},{key:"length",get:function(){return this._components.length}},{key:"lastComponent",get:function(){var t=this._components.length-1;return t>=0?this._components[t]:null}},{key:"containsNamedComponent",get:function(){for(var t=0,e=this._components.length;t<e;t++)if(!this._components[t].isIndex)return !0;return !1}},{key:"GetComponent",value:function(t){return this._components[t]}},{key:"PathByAppendingPath",value:function(e){for(var n=new t,r=0,i=0;i<e._components.length&&e._components[i].isParent;++i)r++;for(var a=0;a<this._components.length-r;++a)n._components.push(this._components[a]);for(var o=r;o<e._components.length;++o)n._components.push(e._components[o]);return n}},{key:"componentsString",get:function(){return null==this._componentsString&&(this._componentsString=this._components.join("."),this.isRelative&&(this._componentsString="."+this._componentsString)),this._componentsString},set:function(e){if(this._components.length=0,this._componentsString=e,null!=this._componentsString&&""!=this._componentsString){"."==this._componentsString[0]&&(this._isRelative=!0,this._componentsString=this._componentsString.substring(1));var n,r=S(this._componentsString.split("."));try{for(r.s();!(n=r.n()).done;){var i=n.value;/^(\-|\+)?([0-9]+|Infinity)$/.test(i)?this._components.push(new t.Component(parseInt(i))):this._components.push(new t.Component(i));}}catch(t){r.e(t);}finally{r.f();}}}},{key:"toString",value:function(){return this.componentsString}},{key:"Equals",value:function(t){if(null==t)return !1;if(t._components.length!=this._components.length)return !1;if(t.isRelative!=this.isRelative)return !1;for(var e=0,n=t._components.length;e<n;e++)if(!t._components[e].Equals(this._components[e]))return !1;return !0}},{key:"PathByAppendingComponent",value:function(e){var n,r=new t;return (n=r._components).push.apply(n,y(this._components)),r._components.push(e),r}}],[{key:"self",get:function(){var e=new t;return e._isRelative=!0,e}}]),t}();R.parentId="^",function(t){var e=function(){function e(t){n(this,e),this.index=-1,this.name=null,"string"==typeof t?this.name=t:this.index=t;}return i(e,[{key:"isIndex",get:function(){return this.index>=0}},{key:"isParent",get:function(){return this.name==t.parentId}},{key:"toString",value:function(){return this.isIndex?this.index.toString():this.name}},{key:"Equals",value:function(t){return null!=t&&t.isIndex==this.isIndex&&(this.isIndex?this.index==t.index:this.name==t.name)}}],[{key:"ToParent",value:function(){return new e(t.parentId)}}]),e}();t.Component=e;}(R||(R={})),function(t){function e(t,e){if(!t)throw void 0!==e&&console.warn(e),console.trace&&console.trace(),new Error("")}t.AssertType=function(t,n,r){e(t instanceof n,r);},t.Assert=e;}(I||(I={}));var D=function(t){a(r,t);var e=d(r);function r(){return n(this,r),e.apply(this,arguments)}return i(r)}(c(Error));function L(t){throw new D("".concat(t," is null or undefined"))}var V=function(){function t(){n(this,t),this.parent=null,this._debugMetadata=null,this._path=null;}return i(t,[{key:"debugMetadata",get:function(){return null===this._debugMetadata&&this.parent?this.parent.debugMetadata:this._debugMetadata},set:function(t){this._debugMetadata=t;}},{key:"ownDebugMetadata",get:function(){return this._debugMetadata}},{key:"DebugLineNumberOfPath",value:function(t){if(null===t)return null;var e=this.rootContentContainer;if(e){var n=e.ContentAtPath(t).obj;if(n){var r=n.debugMetadata;if(null!==r)return r.startLineNumber}}return null}},{key:"path",get:function(){if(null==this._path)if(null==this.parent)this._path=new R;else {for(var t=[],e=this,n=_(e.parent,tt);null!==n;){var r=T(e);if(null!=r&&r.hasValidName){if(null===r.name)return L("namedChild.name");t.unshift(new R.Component(r.name));}else t.unshift(new R.Component(n.content.indexOf(e)));e=n,n=_(n.parent,tt);}this._path=new R(t);}return this._path}},{key:"ResolvePath",value:function(t){if(null===t)return L("path");if(t.isRelative){var e=_(this,tt);return null===e&&(I.Assert(null!==this.parent,"Can't resolve relative path because we don't have a parent"),e=_(this.parent,tt),I.Assert(null!==e,"Expected parent to be a container"),I.Assert(t.GetComponent(0).isParent),t=t.tail),null===e?L("nearestContainer"):e.ContentAtPath(t)}var n=this.rootContentContainer;return null===n?L("contentContainer"):n.ContentAtPath(t)}},{key:"ConvertPathToRelative",value:function(t){for(var e=this.path,n=Math.min(t.length,e.length),r=-1,i=0;i<n;++i){var a=e.GetComponent(i),o=t.GetComponent(i);if(!a.Equals(o))break;r=i;}if(-1==r)return t;for(var s=e.componentCount-1-r,l=[],u=0;u<s;++u)l.push(R.Component.ToParent());for(var c=r+1;c<t.componentCount;++c)l.push(t.GetComponent(c));return new R(l,!0)}},{key:"CompactPathString",value:function(t){var e=null,n=null;t.isRelative?(n=t.componentsString,e=this.path.PathByAppendingPath(t).componentsString):(n=this.ConvertPathToRelative(t).componentsString,e=t.componentsString);return n.length<e.length?n:e}},{key:"rootContentContainer",get:function(){for(var t=this;t.parent;)t=t.parent;return _(t,tt)}},{key:"Copy",value:function(){throw Error("Not Implemented: Doesn't support copying")}},{key:"SetChild",value:function(t,e,n){t[e]&&(t[e]=null),t[e]=n,t[e]&&(t[e].parent=this);}},{key:"Equals",value:function(t){return t===this}}]),t}(),j=function(){function t(e){n(this,t),e=void 0!==e?e.toString():"",this.string=e;}return i(t,[{key:"Length",get:function(){return this.string.length}},{key:"Append",value:function(t){null!==t&&(this.string+=t);}},{key:"AppendLine",value:function(t){void 0!==t&&this.Append(t),this.string+="\n";}},{key:"AppendFormat",value:function(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),r=1;r<e;r++)n[r-1]=arguments[r];this.string+=t.replace(/{(\d+)}/g,(function(t,e){return void 0!==n[e]?n[e]:t}));}},{key:"toString",value:function(){return this.string}}]),t}(),M=function(){function t(){if(n(this,t),this.originName=null,this.itemName=null,void 0!==arguments[1]){var e=arguments[0],r=arguments[1];this.originName=e,this.itemName=r;}else if(arguments[0]){var i=arguments[0],a=i.toString().split(".");this.originName=a[0],this.itemName=a[1];}}return i(t,[{key:"isNull",get:function(){return null==this.originName&&null==this.itemName}},{key:"fullName",get:function(){return (null!==this.originName?this.originName:"?")+"."+this.itemName}},{key:"toString",value:function(){return this.fullName}},{key:"Equals",value:function(e){if(e instanceof t){var n=e;return n.itemName==this.itemName&&n.originName==this.originName}return !1}},{key:"copy",value:function(){return new t(this.originName,this.itemName)}},{key:"serialized",value:function(){return JSON.stringify({originName:this.originName,itemName:this.itemName})}}],[{key:"Null",get:function(){return new t(null,null)}},{key:"fromSerializedKey",value:function(e){var n=JSON.parse(e);if(!t.isLikeInkListItem(n))return t.Null;var r=n;return new t(r.originName,r.itemName)}},{key:"isLikeInkListItem",value:function(t){return "object"===e(t)&&(!(!t.hasOwnProperty("originName")||!t.hasOwnProperty("itemName"))&&(("string"==typeof t.originName||null===typeof t.originName)&&("string"==typeof t.itemName||null===typeof t.itemName)))}}]),t}(),B=function(t){a(o,t);var r=d(o);function o(){var t,i=arguments;if(n(this,o),(t=r.call(this,i[0]instanceof o?i[0]:[])).origins=null,t._originNames=[],arguments[0]instanceof o){var a=arguments[0];t._originNames=a.originNames,null!==a.origins&&(t.origins=a.origins.slice());}else if("string"==typeof arguments[0]){var s=arguments[0],l=arguments[1];if(t.SetInitialOriginName(s),null===l.listDefinitions)return f(t,L("originStory.listDefinitions"));var u=l.listDefinitions.TryListGetDefinition(s,null);if(!u.exists)throw new Error("InkList origin could not be found in story when constructing new list: "+s);if(null===u.result)return f(t,L("def.result"));t.origins=[u.result];}else if("object"===e(arguments[0])&&arguments[0].hasOwnProperty("Key")&&arguments[0].hasOwnProperty("Value")){var c=arguments[0];t.Add(c.Key,c.Value);}return t}return i(o,[{key:"AddItem",value:function(t){if(t instanceof M){var e=t;if(null==e.originName)return void this.AddItem(e.itemName);if(null===this.origins)return L("this.origins");var n,r=S(this.origins);try{for(r.s();!(n=r.n()).done;){var i=n.value;if(i.name==e.originName){var a=i.TryGetValueForItem(e,0);if(a.exists)return void this.Add(e,a.result);throw new Error("Could not add the item "+e+" to this list because it doesn't exist in the original list definition in ink.")}}}catch(t){r.e(t);}finally{r.f();}throw new Error("Failed to add item to list because the item was from a new list definition that wasn't previously known to this list. Only items from previously known lists can be used, so that the int value can be found.")}var o=t,s=null;if(null===this.origins)return L("this.origins");var l,u=S(this.origins);try{for(u.s();!(l=u.n()).done;){var c=l.value;if(null===o)return L("itemName");if(c.ContainsItemWithName(o)){if(null!=s)throw new Error("Could not add the item "+o+" to this list because it could come from either "+c.name+" or "+s.name);s=c;}}}catch(t){u.e(t);}finally{u.f();}if(null==s)throw new Error("Could not add the item "+o+" to this list because it isn't known to any list definitions previously associated with this list.");var h=new M(s.name,o),f=s.ValueForItem(h);this.Add(h,f);}},{key:"ContainsItemNamed",value:function(t){var e,n=S(this);try{for(n.s();!(e=n.n()).done;){var r=m(e.value,1)[0];if(M.fromSerializedKey(r).itemName==t)return !0}}catch(t){n.e(t);}finally{n.f();}return !1}},{key:"ContainsKey",value:function(t){return this.has(t.serialized())}},{key:"Add",value:function(t,e){var n=t.serialized();if(this.has(n))throw new Error("The Map already contains an entry for ".concat(t));this.set(n,e);}},{key:"Remove",value:function(t){return this.delete(t.serialized())}},{key:"Count",get:function(){return this.size}},{key:"originOfMaxItem",get:function(){if(null==this.origins)return null;var t=this.maxItem.Key.originName,e=null;return this.origins.every((function(n){return n.name!=t||(e=n,!1)})),e}},{key:"originNames",get:function(){if(this.Count>0){null==this._originNames&&this.Count>0?this._originNames=[]:(this._originNames||(this._originNames=[]),this._originNames.length=0);var t,e=S(this);try{for(e.s();!(t=e.n()).done;){var n=m(t.value,1)[0],r=M.fromSerializedKey(n);if(null===r.originName)return L("item.originName");this._originNames.push(r.originName);}}catch(t){e.e(t);}finally{e.f();}}return this._originNames}},{key:"SetInitialOriginName",value:function(t){this._originNames=[t];}},{key:"SetInitialOriginNames",value:function(t){this._originNames=null==t?null:t.slice();}},{key:"maxItem",get:function(){var t,e={Key:M.Null,Value:0},n=S(this);try{for(n.s();!(t=n.n()).done;){var r=m(t.value,2),i=r[0],a=r[1],o=M.fromSerializedKey(i);(e.Key.isNull||a>e.Value)&&(e={Key:o,Value:a});}}catch(t){n.e(t);}finally{n.f();}return e}},{key:"minItem",get:function(){var t,e={Key:M.Null,Value:0},n=S(this);try{for(n.s();!(t=n.n()).done;){var r=m(t.value,2),i=r[0],a=r[1],o=M.fromSerializedKey(i);(e.Key.isNull||a<e.Value)&&(e={Key:o,Value:a});}}catch(t){n.e(t);}finally{n.f();}return e}},{key:"inverse",get:function(){var t=new o;if(null!=this.origins){var e,n=S(this.origins);try{for(n.s();!(e=n.n()).done;){var r,i=S(e.value.items);try{for(i.s();!(r=i.n()).done;){var a=m(r.value,2),s=a[0],l=a[1],u=M.fromSerializedKey(s);this.ContainsKey(u)||t.Add(u,l);}}catch(t){i.e(t);}finally{i.f();}}}catch(t){n.e(t);}finally{n.f();}}return t}},{key:"all",get:function(){var t=new o;if(null!=this.origins){var e,n=S(this.origins);try{for(n.s();!(e=n.n()).done;){var r,i=S(e.value.items);try{for(i.s();!(r=i.n()).done;){var a=m(r.value,2),s=a[0],l=a[1],u=M.fromSerializedKey(s);t.set(u.serialized(),l);}}catch(t){i.e(t);}finally{i.f();}}}catch(t){n.e(t);}finally{n.f();}}return t}},{key:"Union",value:function(t){var e,n=new o(this),r=S(t);try{for(r.s();!(e=r.n()).done;){var i=m(e.value,2),a=i[0],s=i[1];n.set(a,s);}}catch(t){r.e(t);}finally{r.f();}return n}},{key:"Intersect",value:function(t){var e,n=new o,r=S(this);try{for(r.s();!(e=r.n()).done;){var i=m(e.value,2),a=i[0],s=i[1];t.has(a)&&n.set(a,s);}}catch(t){r.e(t);}finally{r.f();}return n}},{key:"Without",value:function(t){var e,n=new o(this),r=S(t);try{for(r.s();!(e=r.n()).done;){var i=m(e.value,1)[0];n.delete(i);}}catch(t){r.e(t);}finally{r.f();}return n}},{key:"Contains",value:function(t){var e,n=S(t);try{for(n.s();!(e=n.n()).done;){var r=m(e.value,1)[0];if(!this.has(r))return !1}}catch(t){n.e(t);}finally{n.f();}return !0}},{key:"GreaterThan",value:function(t){return 0!=this.Count&&(0==t.Count||this.minItem.Value>t.maxItem.Value)}},{key:"GreaterThanOrEquals",value:function(t){return 0!=this.Count&&(0==t.Count||this.minItem.Value>=t.minItem.Value&&this.maxItem.Value>=t.maxItem.Value)}},{key:"LessThan",value:function(t){return 0!=t.Count&&(0==this.Count||this.maxItem.Value<t.minItem.Value)}},{key:"LessThanOrEquals",value:function(t){return 0!=t.Count&&(0==this.Count||this.maxItem.Value<=t.maxItem.Value&&this.minItem.Value<=t.minItem.Value)}},{key:"MaxAsList",value:function(){return this.Count>0?new o(this.maxItem):new o}},{key:"MinAsList",value:function(){return this.Count>0?new o(this.minItem):new o}},{key:"ListWithSubRange",value:function(t,e){if(0==this.Count)return new o;var n=this.orderedItems,r=0,i=Number.MAX_SAFE_INTEGER;Number.isInteger(t)?r=t:t instanceof o&&t.Count>0&&(r=t.minItem.Value),Number.isInteger(e)?i=e:t instanceof o&&t.Count>0&&(i=e.maxItem.Value);var a=new o;a.SetInitialOriginNames(this.originNames);var s,l=S(n);try{for(l.s();!(s=l.n()).done;){var u=s.value;u.Value>=r&&u.Value<=i&&a.Add(u.Key,u.Value);}}catch(t){l.e(t);}finally{l.f();}return a}},{key:"Equals",value:function(t){if(t instanceof o==!1)return !1;if(t.Count!=this.Count)return !1;var e,n=S(this);try{for(n.s();!(e=n.n()).done;){var r=m(e.value,1)[0];if(!t.has(r))return !1}}catch(t){n.e(t);}finally{n.f();}return !0}},{key:"orderedItems",get:function(){var t,e=new Array,n=S(this);try{for(n.s();!(t=n.n()).done;){var r=m(t.value,2),i=r[0],a=r[1],o=M.fromSerializedKey(i);e.push({Key:o,Value:a});}}catch(t){n.e(t);}finally{n.f();}return e.sort((function(t,e){return null===t.Key.originName?L("x.Key.originName"):null===e.Key.originName?L("y.Key.originName"):t.Value==e.Value?t.Key.originName.localeCompare(e.Key.originName):t.Value<e.Value?-1:t.Value>e.Value?1:0})),e}},{key:"toString",value:function(){for(var t=this.orderedItems,e=new j,n=0;n<t.length;n++){n>0&&e.Append(", ");var r=t[n].Key;if(null===r.itemName)return L("item.itemName");e.Append(r.itemName);}return e.toString()}},{key:"valueOf",value:function(){return NaN}}],[{key:"FromString",value:function(t,e){var n,r=null===(n=e.listDefinitions)||void 0===n?void 0:n.FindSingleItemListWithName(t);if(r)return null===r.value?L("listValue.value"):new o(r.value);throw new Error("Could not find the InkListItem from the string '"+t+"' to create an InkList because it doesn't exist in the original list definition in ink.")}}]),o}(c(Map)),G=function(t){a(r,t);var e=d(r);function r(t){var i;return n(this,r),(i=e.call(this,t)).useEndLineNumber=!1,i.message=t,i.name="StoryException",i}return i(r)}(c(Error));function q(t,e,n){if(null===t)return {result:n,exists:!1};var r=t.get(e);return void 0===r?{result:n,exists:!1}:{result:r,exists:!0}}var U,K=function(t){a(r,t);var e=d(r);function r(t){var i;return n(this,r),(i=e.call(this)).value=t,i}return i(r,[{key:"valueObject",get:function(){return this.value}},{key:"toString",value:function(){return null===this.value?L("Value.value"):this.value.toString()}}]),r}(function(t){a(r,t);var e=d(r);function r(){return n(this,r),e.apply(this,arguments)}return i(r,[{key:"Copy",value:function(){return A(r.Create(this.valueObject),V)}},{key:"BadCastException",value:function(t){return new G("Can't cast "+this.valueObject+" from "+this.valueType+" to "+t)}}],[{key:"Create",value:function(t,e){if(e){if(e===U.Int&&Number.isInteger(Number(t)))return new J(Number(t));if(e===U.Float&&!isNaN(t))return new z(Number(t))}return "boolean"==typeof t?new H(Boolean(t)):"string"==typeof t?new $(String(t)):Number.isInteger(Number(t))?new J(Number(t)):isNaN(t)?t instanceof R?new X(A(t,R)):t instanceof B?new Z(A(t,B)):null:new z(Number(t))}}]),r}(V)),H=function(t){a(r,t);var e=d(r);function r(t){return n(this,r),e.call(this,t||!1)}return i(r,[{key:"isTruthy",get:function(){return Boolean(this.value)}},{key:"valueType",get:function(){return U.Bool}},{key:"Cast",value:function(t){if(null===this.value)return L("Value.value");if(t==this.valueType)return this;if(t==U.Int)return new J(this.value?1:0);if(t==U.Float)return new z(this.value?1:0);if(t==U.String)return new $(this.value?"true":"false");throw this.BadCastException(t)}},{key:"toString",value:function(){return this.value?"true":"false"}}]),r}(K),J=function(t){a(r,t);var e=d(r);function r(t){return n(this,r),e.call(this,t||0)}return i(r,[{key:"isTruthy",get:function(){return 0!=this.value}},{key:"valueType",get:function(){return U.Int}},{key:"Cast",value:function(t){if(null===this.value)return L("Value.value");if(t==this.valueType)return this;if(t==U.Bool)return new H(0!==this.value);if(t==U.Float)return new z(this.value);if(t==U.String)return new $(""+this.value);throw this.BadCastException(t)}}]),r}(K),z=function(t){a(r,t);var e=d(r);function r(t){return n(this,r),e.call(this,t||0)}return i(r,[{key:"isTruthy",get:function(){return 0!=this.value}},{key:"valueType",get:function(){return U.Float}},{key:"Cast",value:function(t){if(null===this.value)return L("Value.value");if(t==this.valueType)return this;if(t==U.Bool)return new H(0!==this.value);if(t==U.Int)return new J(this.value);if(t==U.String)return new $(""+this.value);throw this.BadCastException(t)}}]),r}(K),$=function(t){a(r,t);var e=d(r);function r(t){var i;return n(this,r),(i=e.call(this,t||""))._isNewline="\n"==i.value,i._isInlineWhitespace=!0,null===i.value?f(i,L("Value.value")):(i.value.length>0&&i.value.split("").every((function(t){return " "==t||"\t"==t||(i._isInlineWhitespace=!1,!1)})),i)}return i(r,[{key:"valueType",get:function(){return U.String}},{key:"isTruthy",get:function(){return null===this.value?L("Value.value"):this.value.length>0}},{key:"isNewline",get:function(){return this._isNewline}},{key:"isInlineWhitespace",get:function(){return this._isInlineWhitespace}},{key:"isNonWhitespace",get:function(){return !this.isNewline&&!this.isInlineWhitespace}},{key:"Cast",value:function(t){if(t==this.valueType)return this;if(t==U.Int){var e=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=parseInt(t);return Number.isNaN(n)?{result:e,exists:!1}:{result:n,exists:!0}}(this.value);if(e.exists)return new J(e.result);throw this.BadCastException(t)}if(t==U.Float){var n=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=parseFloat(t);return Number.isNaN(n)?{result:e,exists:!1}:{result:n,exists:!0}}(this.value);if(n.exists)return new z(n.result);throw this.BadCastException(t)}throw this.BadCastException(t)}}]),r}(K),X=function(t){a(r,t);var e=d(r);function r(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;return n(this,r),e.call(this,t)}return i(r,[{key:"valueType",get:function(){return U.DivertTarget}},{key:"targetPath",get:function(){return null===this.value?L("Value.value"):this.value},set:function(t){this.value=t;}},{key:"isTruthy",get:function(){throw new Error("Shouldn't be checking the truthiness of a divert target")}},{key:"Cast",value:function(t){if(t==this.valueType)return this;throw this.BadCastException(t)}},{key:"toString",value:function(){return "DivertTargetValue("+this.targetPath+")"}}]),r}(K),Y=function(t){a(r,t);var e=d(r);function r(t){var i,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1;return n(this,r),(i=e.call(this,t))._contextIndex=a,i}return i(r,[{key:"contextIndex",get:function(){return this._contextIndex},set:function(t){this._contextIndex=t;}},{key:"variableName",get:function(){return null===this.value?L("Value.value"):this.value},set:function(t){this.value=t;}},{key:"valueType",get:function(){return U.VariablePointer}},{key:"isTruthy",get:function(){throw new Error("Shouldn't be checking the truthiness of a variable pointer")}},{key:"Cast",value:function(t){if(t==this.valueType)return this;throw this.BadCastException(t)}},{key:"toString",value:function(){return "VariablePointerValue("+this.variableName+")"}},{key:"Copy",value:function(){return new r(this.variableName,this.contextIndex)}}]),r}(K),Z=function(t){a(r,t);var e=d(r);function r(t,i){var a;return n(this,r),a=e.call(this,null),t||i?t instanceof B?a.value=new B(t):t instanceof M&&"number"==typeof i&&(a.value=new B({Key:t,Value:i})):a.value=new B,a}return i(r,[{key:"isTruthy",get:function(){return null===this.value?L("this.value"):this.value.Count>0}},{key:"valueType",get:function(){return U.List}},{key:"Cast",value:function(t){if(null===this.value)return L("Value.value");if(t==U.Int){var e=this.value.maxItem;return e.Key.isNull?new J(0):new J(e.Value)}if(t==U.Float){var n=this.value.maxItem;return n.Key.isNull?new z(0):new z(n.Value)}if(t==U.String){var r=this.value.maxItem;return r.Key.isNull?new $(""):new $(r.Key.toString())}if(t==this.valueType)return this;throw this.BadCastException(t)}}],[{key:"RetainListOriginsForAssignment",value:function(t,e){var n=_(t,r),i=_(e,r);return i&&null===i.value?L("newList.value"):n&&null===n.value?L("oldList.value"):void(n&&i&&0==i.value.Count&&i.value.SetInitialOriginNames(n.value.originNames))}}]),r}(K);!function(t){t[t.Bool=-1]="Bool",t[t.Int=0]="Int",t[t.Float=1]="Float",t[t.List=2]="List",t[t.String=3]="String",t[t.DivertTarget=4]="DivertTarget",t[t.VariablePointer=5]="VariablePointer";}(U||(U={}));var Q=function(){function t(){n(this,t),this.obj=null,this.approximate=!1;}return i(t,[{key:"correctObj",get:function(){return this.approximate?null:this.obj}},{key:"container",get:function(){return this.obj instanceof tt?this.obj:null}},{key:"copy",value:function(){var e=new t;return e.obj=this.obj,e.approximate=this.approximate,e}}]),t}(),tt=function(t){a(r,t);var e=d(r);function r(){var t;return n(this,r),(t=e.apply(this,arguments)).name=null,t._content=[],t.namedContent=new Map,t.visitsShouldBeCounted=!1,t.turnIndexShouldBeCounted=!1,t.countingAtStartOnly=!1,t._pathToFirstLeafContent=null,t}return i(r,[{key:"hasValidName",get:function(){return null!=this.name&&this.name.length>0}},{key:"content",get:function(){return this._content},set:function(t){this.AddContent(t);}},{key:"namedOnlyContent",get:function(){var t,e=new Map,n=S(this.namedContent);try{for(n.s();!(t=n.n()).done;){var r=m(t.value,2),i=r[0],a=A(r[1],V);e.set(i,a);}}catch(t){n.e(t);}finally{n.f();}var o,s=S(this.content);try{for(s.s();!(o=s.n()).done;){var l=T(o.value);null!=l&&l.hasValidName&&e.delete(l.name);}}catch(t){s.e(t);}finally{s.f();}return 0==e.size&&(e=null),e},set:function(t){var e=this.namedOnlyContent;if(null!=e){var n,r=S(e);try{for(r.s();!(n=r.n()).done;){var i=m(n.value,1)[0];this.namedContent.delete(i);}}catch(t){r.e(t);}finally{r.f();}}if(null!=t){var a,o=S(t);try{for(o.s();!(a=o.n()).done;){var s=T(m(a.value,2)[1]);null!=s&&this.AddToNamedContentOnly(s);}}catch(t){o.e(t);}finally{o.f();}}}},{key:"countFlags",get:function(){var t=0;return this.visitsShouldBeCounted&&(t|=r.CountFlags.Visits),this.turnIndexShouldBeCounted&&(t|=r.CountFlags.Turns),this.countingAtStartOnly&&(t|=r.CountFlags.CountStartOnly),t==r.CountFlags.CountStartOnly&&(t=0),t},set:function(t){var e=t;(e&r.CountFlags.Visits)>0&&(this.visitsShouldBeCounted=!0),(e&r.CountFlags.Turns)>0&&(this.turnIndexShouldBeCounted=!0),(e&r.CountFlags.CountStartOnly)>0&&(this.countingAtStartOnly=!0);}},{key:"pathToFirstLeafContent",get:function(){return null==this._pathToFirstLeafContent&&(this._pathToFirstLeafContent=this.path.PathByAppendingPath(this.internalPathToFirstLeafContent)),this._pathToFirstLeafContent}},{key:"internalPathToFirstLeafContent",get:function(){for(var t=[],e=this;e instanceof r;)e.content.length>0&&(t.push(new R.Component(0)),e=e.content[0]);return new R(t)}},{key:"AddContent",value:function(t){if(t instanceof Array){var e,n=S(t);try{for(n.s();!(e=n.n()).done;){var r=e.value;this.AddContent(r);}}catch(t){n.e(t);}finally{n.f();}}else {var i=t;if(this._content.push(i),i.parent)throw new Error("content is already in "+i.parent);i.parent=this,this.TryAddNamedContent(i);}}},{key:"TryAddNamedContent",value:function(t){var e=T(t);null!=e&&e.hasValidName&&this.AddToNamedContentOnly(e);}},{key:"AddToNamedContentOnly",value:function(t){if(I.AssertType(t,V,"Can only add Runtime.Objects to a Runtime.Container"),A(t,V).parent=this,null===t.name)return L("namedContentObj.name");this.namedContent.set(t.name,t);}},{key:"ContentAtPath",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:-1;-1==n&&(n=t.length);var i=new Q;i.approximate=!1;for(var a=this,o=this,s=e;s<n;++s){var l=t.GetComponent(s);if(null==a){i.approximate=!0;break}var u=a.ContentWithPathComponent(l);if(null==u){i.approximate=!0;break}o=u,a=_(u,r);}return i.obj=o,i}},{key:"InsertContent",value:function(t,e){if(this.content.splice(e,0,t),t.parent)throw new Error("content is already in "+t.parent);t.parent=this,this.TryAddNamedContent(t);}},{key:"AddContentsOfContainer",value:function(t){var e;(e=this.content).push.apply(e,y(t.content));var n,r=S(t.content);try{for(r.s();!(n=r.n()).done;){var i=n.value;i.parent=this,this.TryAddNamedContent(i);}}catch(t){r.e(t);}finally{r.f();}}},{key:"ContentWithPathComponent",value:function(t){if(t.isIndex)return t.index>=0&&t.index<this.content.length?this.content[t.index]:null;if(t.isParent)return this.parent;if(null===t.name)return L("component.name");var e=q(this.namedContent,t.name,null);return e.exists?A(e.result,V):null}},{key:"BuildStringOfHierarchy",value:function(){var t;if(0==arguments.length)return t=new j,this.BuildStringOfHierarchy(t,0,null),t.toString();t=arguments[0];var e=arguments[1],n=arguments[2];function i(){for(var n=0;n<4*e;++n)t.Append(" ");}i(),t.Append("["),this.hasValidName&&t.AppendFormat(" ({0})",this.name),this==n&&t.Append("  <---"),t.AppendLine(),e++;for(var a=0;a<this.content.length;++a){var o=this.content[a];if(o instanceof r){var s=o;s.BuildStringOfHierarchy(t,e,n);}else i(),o instanceof $?(t.Append('"'),t.Append(o.toString().replace("\n","\\n")),t.Append('"')):t.Append(o.toString());a!=this.content.length-1&&t.Append(","),o instanceof r||o!=n||t.Append("  <---"),t.AppendLine();}var l,u=new Map,c=S(this.namedContent);try{for(c.s();!(l=c.n()).done;){var h=m(l.value,2),f=h[0],d=h[1];this.content.indexOf(A(d,V))>=0||u.set(f,d);}}catch(t){c.e(t);}finally{c.f();}if(u.size>0){i(),t.AppendLine("-- named: --");var v,p=S(u);try{for(p.s();!(v=p.n()).done;){var y=m(v.value,2),g=y[1];I.AssertType(g,r,"Can only print out named Containers");var C=g;C.BuildStringOfHierarchy(t,e,n),t.AppendLine();}}catch(t){p.e(t);}finally{p.f();}}e--,i(),t.Append("]");}}]),r}(V);!function(t){var e;(e=t.CountFlags||(t.CountFlags={}))[e.Visits=1]="Visits",e[e.Turns=2]="Turns",e[e.CountStartOnly=4]="CountStartOnly";}(tt||(tt={}));var et=function(t){a(r,t);var e=d(r);function r(){var t,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:r.CommandType.NotSet;return n(this,r),(t=e.call(this))._commandType=i,t}return i(r,[{key:"commandType",get:function(){return this._commandType}},{key:"Copy",value:function(){return new r(this.commandType)}},{key:"toString",value:function(){return this.commandType.toString()}}],[{key:"EvalStart",value:function(){return new r(r.CommandType.EvalStart)}},{key:"EvalOutput",value:function(){return new r(r.CommandType.EvalOutput)}},{key:"EvalEnd",value:function(){return new r(r.CommandType.EvalEnd)}},{key:"Duplicate",value:function(){return new r(r.CommandType.Duplicate)}},{key:"PopEvaluatedValue",value:function(){return new r(r.CommandType.PopEvaluatedValue)}},{key:"PopFunction",value:function(){return new r(r.CommandType.PopFunction)}},{key:"PopTunnel",value:function(){return new r(r.CommandType.PopTunnel)}},{key:"BeginString",value:function(){return new r(r.CommandType.BeginString)}},{key:"EndString",value:function(){return new r(r.CommandType.EndString)}},{key:"NoOp",value:function(){return new r(r.CommandType.NoOp)}},{key:"ChoiceCount",value:function(){return new r(r.CommandType.ChoiceCount)}},{key:"Turns",value:function(){return new r(r.CommandType.Turns)}},{key:"TurnsSince",value:function(){return new r(r.CommandType.TurnsSince)}},{key:"ReadCount",value:function(){return new r(r.CommandType.ReadCount)}},{key:"Random",value:function(){return new r(r.CommandType.Random)}},{key:"SeedRandom",value:function(){return new r(r.CommandType.SeedRandom)}},{key:"VisitIndex",value:function(){return new r(r.CommandType.VisitIndex)}},{key:"SequenceShuffleIndex",value:function(){return new r(r.CommandType.SequenceShuffleIndex)}},{key:"StartThread",value:function(){return new r(r.CommandType.StartThread)}},{key:"Done",value:function(){return new r(r.CommandType.Done)}},{key:"End",value:function(){return new r(r.CommandType.End)}},{key:"ListFromInt",value:function(){return new r(r.CommandType.ListFromInt)}},{key:"ListRange",value:function(){return new r(r.CommandType.ListRange)}},{key:"ListRandom",value:function(){return new r(r.CommandType.ListRandom)}}]),r}(V);!function(t){var e;(e=t.CommandType||(t.CommandType={}))[e.NotSet=-1]="NotSet",e[e.EvalStart=0]="EvalStart",e[e.EvalOutput=1]="EvalOutput",e[e.EvalEnd=2]="EvalEnd",e[e.Duplicate=3]="Duplicate",e[e.PopEvaluatedValue=4]="PopEvaluatedValue",e[e.PopFunction=5]="PopFunction",e[e.PopTunnel=6]="PopTunnel",e[e.BeginString=7]="BeginString",e[e.EndString=8]="EndString",e[e.NoOp=9]="NoOp",e[e.ChoiceCount=10]="ChoiceCount",e[e.Turns=11]="Turns",e[e.TurnsSince=12]="TurnsSince",e[e.Random=13]="Random",e[e.SeedRandom=14]="SeedRandom",e[e.VisitIndex=15]="VisitIndex",e[e.SequenceShuffleIndex=16]="SequenceShuffleIndex",e[e.StartThread=17]="StartThread",e[e.Done=18]="Done",e[e.End=19]="End",e[e.ListFromInt=20]="ListFromInt",e[e.ListRange=21]="ListRange",e[e.ListRandom=22]="ListRandom",e[e.ReadCount=23]="ReadCount",e[e.TOTAL_VALUES=24]="TOTAL_VALUES";}(et||(et={}));var nt=function(t){a(r,t);var e=d(r);function r(){var t;return n(this,r),(t=e.apply(this,arguments))._prototypeRuntimeConstantExpression=null,t.outputWhenComplete=!1,t.GenerateRuntimeObject=function(){var e=new tt;return e.AddContent(et.EvalStart()),t.GenerateIntoContainer(e),t.outputWhenComplete&&e.AddContent(et.EvalOutput()),e.AddContent(et.EvalEnd()),e},t.GenerateConstantIntoContainer=function(e){null===t._prototypeRuntimeConstantExpression&&(t._prototypeRuntimeConstantExpression=new tt,t.GenerateIntoContainer(t._prototypeRuntimeConstantExpression));var n,r=S(t._prototypeRuntimeConstantExpression.content);try{for(r.s();!(n=r.n()).done;){var i=n.value.Copy();i&&e.AddContent(i);}}catch(t){r.e(t);}finally{r.f();}},t.toString=function(){return "No string value in JavaScript."},t}return i(r,[{key:"typeName",get:function(){return "Expression"}},{key:"Equals",value:function(t){return !1}}]),r}(W),rt=function(t){a(r,t);var e=d(r);function r(){return n(this,r),e.apply(this,arguments)}return i(r)}(V),it=function(t){a(r,t);var e=d(r);function r(){var t;if(n(this,r),(t=e.call(this))._name=null,t._numberOfParameters=0,t._prototype=null,t._isPrototype=!1,t._operationFuncs=null,0===arguments.length)r.GenerateNativeFunctionsIfNecessary();else if(1===arguments.length){var i=arguments[0];r.GenerateNativeFunctionsIfNecessary(),t.name=i;}else if(2===arguments.length){var a=arguments[0],o=arguments[1];t._isPrototype=!0,t.name=a,t.numberOfParameters=o;}return t}return i(r,[{key:"name",get:function(){return null===this._name?L("NativeFunctionCall._name"):this._name},set:function(t){this._name=t,this._isPrototype||(null===r._nativeFunctions?L("NativeFunctionCall._nativeFunctions"):this._prototype=r._nativeFunctions.get(this._name)||null);}},{key:"numberOfParameters",get:function(){return this._prototype?this._prototype.numberOfParameters:this._numberOfParameters},set:function(t){this._numberOfParameters=t;}},{key:"Call",value:function(t){if(this._prototype)return this._prototype.Call(t);if(this.numberOfParameters!=t.length)throw new Error("Unexpected number of parameters");var e,n=!1,r=S(t);try{for(r.s();!(e=r.n()).done;){var i=e.value;if(i instanceof rt)throw new G('Attempting to perform operation on a void value. Did you forget to "return" a value from a function you called here?');i instanceof Z&&(n=!0);}}catch(t){r.e(t);}finally{r.f();}if(2==t.length&&n)return this.CallBinaryListOperation(t);var a=this.CoerceValuesToSingleType(t),o=a[0].valueType;return o==U.Int||o==U.Float||o==U.String||o==U.DivertTarget||o==U.List?this.CallType(a):null}},{key:"CallType",value:function(t){var e=A(t[0],K),n=e.valueType,i=e,a=t.length;if(2==a||1==a){if(null===this._operationFuncs)return L("NativeFunctionCall._operationFuncs");var o=this._operationFuncs.get(n);if(!o){var s=U[n];throw new G("Cannot perform operation "+this.name+" on "+s)}if(2==a){var l=A(t[1],K),u=o;if(null===i.value||null===l.value)return L("NativeFunctionCall.Call BinaryOp values");var c=u(i.value,l.value);return K.Create(c)}var h=o;if(null===i.value)return L("NativeFunctionCall.Call UnaryOp value");var f=h(i.value);return this.name===r.Int?K.Create(f,U.Int):this.name===r.Float?K.Create(f,U.Float):K.Create(f,e.valueType)}throw new Error("Unexpected number of parameters to NativeFunctionCall: "+t.length)}},{key:"CallBinaryListOperation",value:function(t){if(("+"==this.name||"-"==this.name)&&t[0]instanceof Z&&t[1]instanceof J)return this.CallListIncrementOperation(t);var e=A(t[0],K),n=A(t[1],K);if(!("&&"!=this.name&&"||"!=this.name||e.valueType==U.List&&n.valueType==U.List)){if(null===this._operationFuncs)return L("NativeFunctionCall._operationFuncs");var r=this._operationFuncs.get(U.Int);if(null===r)return L("NativeFunctionCall.CallBinaryListOperation op");var i=function(t){if("boolean"==typeof t)return t;throw new Error("".concat(t," is not a boolean"))}(r(e.isTruthy?1:0,n.isTruthy?1:0));return new H(i)}if(e.valueType==U.List&&n.valueType==U.List)return this.CallType([e,n]);throw new G("Can not call use "+this.name+" operation on "+U[e.valueType]+" and "+U[n.valueType])}},{key:"CallListIncrementOperation",value:function(t){var e=A(t[0],Z),n=A(t[1],J),r=new B;if(null===e.value)return L("NativeFunctionCall.CallListIncrementOperation listVal.value");var i,a=S(e.value);try{for(a.s();!(i=a.n()).done;){var o=m(i.value,2),s=o[0],l=o[1],u=M.fromSerializedKey(s);if(null===this._operationFuncs)return L("NativeFunctionCall._operationFuncs");var c=this._operationFuncs.get(U.Int);if(null===n.value)return L("NativeFunctionCall.CallListIncrementOperation intVal.value");var h=c(l,n.value),f=null;if(null===e.value.origins)return L("NativeFunctionCall.CallListIncrementOperation listVal.value.origins");var d,v=S(e.value.origins);try{for(v.s();!(d=v.n()).done;){var p=d.value;if(p.name==u.originName){f=p;break}}}catch(t){v.e(t);}finally{v.f();}if(null!=f){var y=f.TryGetItemWithValue(h,M.Null);y.exists&&r.Add(y.result,h);}}}catch(t){a.e(t);}finally{a.f();}return new Z(r)}},{key:"CoerceValuesToSingleType",value:function(t){var e,n=U.Int,r=null,i=S(t);try{for(i.s();!(e=i.n()).done;){var a=A(e.value,K);a.valueType>n&&(n=a.valueType),a.valueType==U.List&&(r=_(a,Z));}}catch(t){i.e(t);}finally{i.f();}var o=[];if(U[n]==U[U.List]){var s,l=S(t);try{for(l.s();!(s=l.n()).done;){var u=A(s.value,K);if(u.valueType==U.List)o.push(u);else {if(u.valueType!=U.Int){var c=U[u.valueType];throw new G("Cannot mix Lists and "+c+" values in this operation")}var h=parseInt(u.valueObject);if(null===(r=A(r,Z)).value)return L("NativeFunctionCall.CoerceValuesToSingleType specialCaseList.value");var f=r.value.originOfMaxItem;if(null===f)return L("NativeFunctionCall.CoerceValuesToSingleType list");var d=f.TryGetItemWithValue(h,M.Null);if(!d.exists)throw new G("Could not find List item with the value "+h+" in "+f.name);var v=new Z(d.result,h);o.push(v);}}}catch(t){l.e(t);}finally{l.f();}}else {var p,m=S(t);try{for(m.s();!(p=m.n()).done;){var y=A(p.value,K).Cast(n);o.push(y);}}catch(t){m.e(t);}finally{m.f();}}return o}},{key:"AddOpFuncForType",value:function(t,e){null==this._operationFuncs&&(this._operationFuncs=new Map),this._operationFuncs.set(t,e);}},{key:"toString",value:function(){return 'Native "'+this.name+'"'}}],[{key:"CallWithName",value:function(t){return new r(t)}},{key:"CallExistsWithName",value:function(t){return this.GenerateNativeFunctionsIfNecessary(),this._nativeFunctions.get(t)}},{key:"Identity",value:function(t){return t}},{key:"GenerateNativeFunctionsIfNecessary",value:function(){if(null==this._nativeFunctions){this._nativeFunctions=new Map,this.AddIntBinaryOp(this.Add,(function(t,e){return t+e})),this.AddIntBinaryOp(this.Subtract,(function(t,e){return t-e})),this.AddIntBinaryOp(this.Multiply,(function(t,e){return t*e})),this.AddIntBinaryOp(this.Divide,(function(t,e){return Math.floor(t/e)})),this.AddIntBinaryOp(this.Mod,(function(t,e){return t%e})),this.AddIntUnaryOp(this.Negate,(function(t){return -t})),this.AddIntBinaryOp(this.Equal,(function(t,e){return t==e})),this.AddIntBinaryOp(this.Greater,(function(t,e){return t>e})),this.AddIntBinaryOp(this.Less,(function(t,e){return t<e})),this.AddIntBinaryOp(this.GreaterThanOrEquals,(function(t,e){return t>=e})),this.AddIntBinaryOp(this.LessThanOrEquals,(function(t,e){return t<=e})),this.AddIntBinaryOp(this.NotEquals,(function(t,e){return t!=e})),this.AddIntUnaryOp(this.Not,(function(t){return 0==t})),this.AddIntBinaryOp(this.And,(function(t,e){return 0!=t&&0!=e})),this.AddIntBinaryOp(this.Or,(function(t,e){return 0!=t||0!=e})),this.AddIntBinaryOp(this.Max,(function(t,e){return Math.max(t,e)})),this.AddIntBinaryOp(this.Min,(function(t,e){return Math.min(t,e)})),this.AddIntBinaryOp(this.Pow,(function(t,e){return Math.pow(t,e)})),this.AddIntUnaryOp(this.Floor,r.Identity),this.AddIntUnaryOp(this.Ceiling,r.Identity),this.AddIntUnaryOp(this.Int,r.Identity),this.AddIntUnaryOp(this.Float,(function(t){return t})),this.AddFloatBinaryOp(this.Add,(function(t,e){return t+e})),this.AddFloatBinaryOp(this.Subtract,(function(t,e){return t-e})),this.AddFloatBinaryOp(this.Multiply,(function(t,e){return t*e})),this.AddFloatBinaryOp(this.Divide,(function(t,e){return t/e})),this.AddFloatBinaryOp(this.Mod,(function(t,e){return t%e})),this.AddFloatUnaryOp(this.Negate,(function(t){return -t})),this.AddFloatBinaryOp(this.Equal,(function(t,e){return t==e})),this.AddFloatBinaryOp(this.Greater,(function(t,e){return t>e})),this.AddFloatBinaryOp(this.Less,(function(t,e){return t<e})),this.AddFloatBinaryOp(this.GreaterThanOrEquals,(function(t,e){return t>=e})),this.AddFloatBinaryOp(this.LessThanOrEquals,(function(t,e){return t<=e})),this.AddFloatBinaryOp(this.NotEquals,(function(t,e){return t!=e})),this.AddFloatUnaryOp(this.Not,(function(t){return 0==t})),this.AddFloatBinaryOp(this.And,(function(t,e){return 0!=t&&0!=e})),this.AddFloatBinaryOp(this.Or,(function(t,e){return 0!=t||0!=e})),this.AddFloatBinaryOp(this.Max,(function(t,e){return Math.max(t,e)})),this.AddFloatBinaryOp(this.Min,(function(t,e){return Math.min(t,e)})),this.AddFloatBinaryOp(this.Pow,(function(t,e){return Math.pow(t,e)})),this.AddFloatUnaryOp(this.Floor,(function(t){return Math.floor(t)})),this.AddFloatUnaryOp(this.Ceiling,(function(t){return Math.ceil(t)})),this.AddFloatUnaryOp(this.Int,(function(t){return Math.floor(t)})),this.AddFloatUnaryOp(this.Float,r.Identity),this.AddStringBinaryOp(this.Add,(function(t,e){return t+e})),this.AddStringBinaryOp(this.Equal,(function(t,e){return t===e})),this.AddStringBinaryOp(this.NotEquals,(function(t,e){return !(t===e)})),this.AddStringBinaryOp(this.Has,(function(t,e){return t.includes(e)})),this.AddStringBinaryOp(this.Hasnt,(function(t,e){return !t.includes(e)})),this.AddListBinaryOp(this.Add,(function(t,e){return t.Union(e)})),this.AddListBinaryOp(this.Subtract,(function(t,e){return t.Without(e)})),this.AddListBinaryOp(this.Has,(function(t,e){return t.Contains(e)})),this.AddListBinaryOp(this.Hasnt,(function(t,e){return !t.Contains(e)})),this.AddListBinaryOp(this.Intersect,(function(t,e){return t.Intersect(e)})),this.AddListBinaryOp(this.Equal,(function(t,e){return t.Equals(e)})),this.AddListBinaryOp(this.Greater,(function(t,e){return t.GreaterThan(e)})),this.AddListBinaryOp(this.Less,(function(t,e){return t.LessThan(e)})),this.AddListBinaryOp(this.GreaterThanOrEquals,(function(t,e){return t.GreaterThanOrEquals(e)})),this.AddListBinaryOp(this.LessThanOrEquals,(function(t,e){return t.LessThanOrEquals(e)})),this.AddListBinaryOp(this.NotEquals,(function(t,e){return !t.Equals(e)})),this.AddListBinaryOp(this.And,(function(t,e){return t.Count>0&&e.Count>0})),this.AddListBinaryOp(this.Or,(function(t,e){return t.Count>0||e.Count>0})),this.AddListUnaryOp(this.Not,(function(t){return 0==t.Count?1:0})),this.AddListUnaryOp(this.Invert,(function(t){return t.inverse})),this.AddListUnaryOp(this.All,(function(t){return t.all})),this.AddListUnaryOp(this.ListMin,(function(t){return t.MinAsList()})),this.AddListUnaryOp(this.ListMax,(function(t){return t.MaxAsList()})),this.AddListUnaryOp(this.Count,(function(t){return t.Count})),this.AddListUnaryOp(this.ValueOfList,(function(t){return t.maxItem.Value}));this.AddOpToNativeFunc(this.Equal,2,U.DivertTarget,(function(t,e){return t.Equals(e)})),this.AddOpToNativeFunc(this.NotEquals,2,U.DivertTarget,(function(t,e){return !t.Equals(e)}));}}},{key:"AddOpToNativeFunc",value:function(t,e,n,i){if(null===this._nativeFunctions)return L("NativeFunctionCall._nativeFunctions");var a=this._nativeFunctions.get(t);a||(a=new r(t,e),this._nativeFunctions.set(t,a)),a.AddOpFuncForType(n,i);}},{key:"AddIntBinaryOp",value:function(t,e){this.AddOpToNativeFunc(t,2,U.Int,e);}},{key:"AddIntUnaryOp",value:function(t,e){this.AddOpToNativeFunc(t,1,U.Int,e);}},{key:"AddFloatBinaryOp",value:function(t,e){this.AddOpToNativeFunc(t,2,U.Float,e);}},{key:"AddFloatUnaryOp",value:function(t,e){this.AddOpToNativeFunc(t,1,U.Float,e);}},{key:"AddStringBinaryOp",value:function(t,e){this.AddOpToNativeFunc(t,2,U.String,e);}},{key:"AddListBinaryOp",value:function(t,e){this.AddOpToNativeFunc(t,2,U.List,e);}},{key:"AddListUnaryOp",value:function(t,e){this.AddOpToNativeFunc(t,1,U.List,e);}}]),r}(V);it.Add="+",it.Subtract="-",it.Divide="/",it.Multiply="*",it.Mod="%",it.Negate="_",it.Equal="==",it.Greater=">",it.Less="<",it.GreaterThanOrEquals=">=",it.LessThanOrEquals="<=",it.NotEquals="!=",it.Not="!",it.And="&&",it.Or="||",it.Min="MIN",it.Max="MAX",it.Pow="POW",it.Floor="FLOOR",it.Ceiling="CEILING",it.Int="INT",it.Float="FLOAT",it.Has="?",it.Hasnt="!?",it.Intersect="^",it.ListMin="LIST_MIN",it.ListMax="LIST_MAX",it.All="LIST_ALL",it.Count="LIST_COUNT",it.ValueOfList="LIST_VALUE",it.Invert="LIST_INVERT",it._nativeFunctions=null;var at=function(t){a(r,t);var e=d(r);function r(t,i){var a;if(n(this,r),(a=e.call(this)).isInt=function(){return "int"==a.subtype},a.isFloat=function(){return "float"==a.subtype},a.isBool=function(){return "bool"==a.subtype},a.GenerateIntoContainer=function(t){a.isInt()?t.AddContent(new J(a.value)):a.isFloat()?t.AddContent(new z(a.value)):a.isBool()&&t.AddContent(new H(a.value));},a.toString=function(){return String(a.value)},("number"!=typeof t||Number.isNaN(t))&&"boolean"!=typeof t)throw new Error("Unexpected object type in NumberExpression.");return a.value=t,a.subtype=i,a}return i(r,[{key:"typeName",get:function(){return "Number"}},{key:"Equals",value:function(t){var e=_(t,r);return !!e&&(e.subtype==this.subtype&&e.value==this.value)}}]),r}(nt),ot=function(t){a(r,t);var e=d(r);function r(t,i){var a;return n(this,r),(a=e.call(this)).op=i,a.GenerateIntoContainer=function(t){a.innerExpression.GenerateIntoContainer(t),t.AddContent(it.CallWithName(a.nativeNameForOp));},a.toString=function(){return a.nativeNameForOp+a.innerExpression},a.innerExpression=a.AddContent(t),a}return i(r,[{key:"nativeNameForOp",get:function(){return "-"===this.op?"_":"not"===this.op?"!":this.op}},{key:"typeName",get:function(){return "UnaryExpression"}}]),r}(nt);ot.WithInner=function(t,e){var n=_(t,at);if(n){if("-"===e){if(n.isInt())return new at(-n.value,"int");if(n.isFloat())return new at(-n.value,"float")}else if("!"==e||"not"==e){if(n.isInt())return new at(0==n.value,"bool");if(n.isFloat())return new at(0==n.value,"bool");if(n.isBool())return new at(!n.value,"bool")}throw new Error("Unexpected operation or number type")}return new ot(t,e)};var st=function(t){a(r,t);var e=d(r);function r(t,i,a){var o;return n(this,r),(o=e.call(this)).opName=a,o.GenerateIntoContainer=function(t){o.leftExpression.GenerateIntoContainer(t),o.rightExpression.GenerateIntoContainer(t),o.opName=o.NativeNameForOp(o.opName),t.AddContent(it.CallWithName(o.opName));},o.NativeNameForOp=function(t){return "and"===t?"&&":"or"===t?"||":"mod"===t?"%":"has"===t?"?":"hasnt"===t?"!?":t},o.toString=function(){return "(".concat(o.leftExpression," ").concat(o.opName," ").concat(o.rightExpression,")")},o.leftExpression=o.AddContent(t),o.rightExpression=o.AddContent(i),o.opName=a,o}return i(r,[{key:"typeName",get:function(){return "BinaryExpression"}},{key:"ResolveReferences",value:function(t){if(p(o(r.prototype),"ResolveReferences",this).call(this,t),"?"===this.NativeNameForOp(this.opName)){var e=_(this.leftExpression,ot);null===e||"not"!==e.op&&"!"!==e.op||this.Error("Using 'not' or '!' here negates '".concat(e.innerExpression,"' rather than the result of the '?' or 'has' operator. You need to add parentheses around the (A ? B) expression."));}}}]),r}(nt),lt=i((function t(e){var r=this;n(this,t),this.set=new Set,this.Add=function(t){return r.set.add(t)},this.AddRange=function(t,e){for(var n=t.charCodeAt(0);n<=e.charCodeAt(0);++n)r.Add(String.fromCharCode(n));return r},this.AddCharacters=function(t){if("string"==typeof t||Array.isArray(t)){var e,n=S(t);try{for(n.s();!(e=n.n()).done;){var i=e.value;r.Add(i);}}catch(t){n.e(t);}finally{n.f();}}else {var a,o=S(t.set);try{for(o.s();!(a=o.n()).done;){var s=a.value;r.Add(s);}}catch(t){o.e(t);}finally{o.f();}}return r},e&&this.AddCharacters(e);}));lt.FromRange=function(t,e){return (new lt).AddRange(t,e)};var ut=function(){function t(e,r){var i=this,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];if(n(this,t),this._start=e,this._end=r,this._correspondingCharSet=new lt,this._excludes=new Set,this.ToCharacterSet=function(){if(0===i._correspondingCharSet.set.size)for(var t=i.start.charCodeAt(0),e=String.fromCharCode(t);t<=i.end.charCodeAt(0);t+=1)i._excludes.has(e)||i._correspondingCharSet.AddCharacters(e);return i._correspondingCharSet},a instanceof lt)this._excludes=a.set;else {var o,s=S(a);try{for(s.s();!(o=s.n()).done;){var l=o.value;this._excludes.add(l);}}catch(t){s.e(t);}finally{s.f();}}}return i(t,[{key:"start",get:function(){return this._start}},{key:"end",get:function(){return this._end}}]),t}();ut.Define=function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];return new ut(t,e,n)};var ct,ht=function(t){a(r,t);var e=d(r);function r(){var t,i=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];return n(this,r),(t=e.call(this))._pathOnChoice=null,t.hasCondition=!1,t.hasStartContent=!1,t.hasChoiceOnlyContent=!1,t.isInvisibleDefault=!1,t.onceOnly=!0,t.onceOnly=i,t}return i(r,[{key:"pathOnChoice",get:function(){if(null!=this._pathOnChoice&&this._pathOnChoice.isRelative){var t=this.choiceTarget;t&&(this._pathOnChoice=t.path);}return this._pathOnChoice},set:function(t){this._pathOnChoice=t;}},{key:"choiceTarget",get:function(){return null===this._pathOnChoice?L("ChoicePoint._pathOnChoice"):this.ResolvePath(this._pathOnChoice).container}},{key:"pathStringOnChoice",get:function(){return null===this.pathOnChoice?L("ChoicePoint.pathOnChoice"):this.CompactPathString(this.pathOnChoice)},set:function(t){this.pathOnChoice=new R(t);}},{key:"flags",get:function(){var t=0;return this.hasCondition&&(t|=1),this.hasStartContent&&(t|=2),this.hasChoiceOnlyContent&&(t|=4),this.isInvisibleDefault&&(t|=8),this.onceOnly&&(t|=16),t},set:function(t){this.hasCondition=(1&t)>0,this.hasStartContent=(2&t)>0,this.hasChoiceOnlyContent=(4&t)>0,this.isInvisibleDefault=(8&t)>0,this.onceOnly=(16&t)>0;}},{key:"toString",value:function(){return null===this.pathOnChoice?L("ChoicePoint.pathOnChoice"):"Choice: -> "+this.pathOnChoice.toString()}}]),r}(V);!function(t){t[t.Tunnel=0]="Tunnel",t[t.Function=1]="Function",t[t.FunctionEvaluationFromGame=2]="FunctionEvaluationFromGame";}(ct||(ct={}));var ft,dt=function(){function t(){n(this,t),this.container=null,this.index=-1,2===arguments.length&&(this.container=arguments[0],this.index=arguments[1]);}return i(t,[{key:"Resolve",value:function(){return this.index<0?this.container:null==this.container?null:0==this.container.content.length?this.container:this.index>=this.container.content.length?null:this.container.content[this.index]}},{key:"isNull",get:function(){return null==this.container}},{key:"path",get:function(){return this.isNull?null:this.index>=0?this.container.path.PathByAppendingComponent(new R.Component(this.index)):this.container.path}},{key:"toString",value:function(){return this.container?"Ink Pointer -> "+this.container.path.toString()+" -- index "+this.index:"Ink Pointer (null)"}},{key:"copy",value:function(){return new t(this.container,this.index)}}],[{key:"StartOf",value:function(e){return new t(e,0)}},{key:"Null",get:function(){return new t(null,-1)}}]),t}(),vt=function(t){a(r,t);var e=d(r);function r(t){var i;return n(this,r),(i=e.call(this))._targetPath=null,i._targetPointer=dt.Null,i.variableDivertName=null,i.pushesToStack=!1,i.stackPushType=0,i.isExternal=!1,i.externalArgs=0,i.isConditional=!1,i.pushesToStack=!1,void 0!==t&&(i.pushesToStack=!0,i.stackPushType=t),i}return i(r,[{key:"targetPath",get:function(){if(null!=this._targetPath&&this._targetPath.isRelative){var t=this.targetPointer.Resolve();t&&(this._targetPath=t.path);}return this._targetPath},set:function(t){this._targetPath=t,this._targetPointer=dt.Null;}},{key:"targetPointer",get:function(){if(this._targetPointer.isNull){var t=this.ResolvePath(this._targetPath).obj;if(null===this._targetPath)return L("this._targetPath");if(null===this._targetPath.lastComponent)return L("this._targetPath.lastComponent");if(this._targetPath.lastComponent.isIndex){if(null===t)return L("targetObj");this._targetPointer.container=t.parent instanceof tt?t.parent:null,this._targetPointer.index=this._targetPath.lastComponent.index;}else this._targetPointer=dt.StartOf(t instanceof tt?t:null);}return this._targetPointer.copy()}},{key:"targetPathString",get:function(){return null==this.targetPath?null:this.CompactPathString(this.targetPath)},set:function(t){this.targetPath=null==t?null:new R(t);}},{key:"hasVariableTarget",get:function(){return null!=this.variableDivertName}},{key:"Equals",value:function(t){var e=t;return e instanceof r&&this.hasVariableTarget==e.hasVariableTarget&&(this.hasVariableTarget?this.variableDivertName==e.variableDivertName:null===this.targetPath?L("this.targetPath"):this.targetPath.Equals(e.targetPath))}},{key:"toString",value:function(){if(this.hasVariableTarget)return "Divert(variable: "+this.variableDivertName+")";if(null==this.targetPath)return "Divert(null)";var t=new j,e=this.targetPath.toString();return t.Append("Divert"),this.isConditional&&t.Append("?"),this.pushesToStack&&(this.stackPushType==ct.Function?t.Append(" function"):t.Append(" tunnel")),t.Append(" -> "),t.Append(this.targetPathString),t.Append(" ("),t.Append(e),t.Append(")"),t.toString()}}]),r}(V);!function(t){t[t.Knot=0]="Knot",t[t.List=1]="List",t[t.ListItem=2]="ListItem",t[t.Var=3]="Var",t[t.SubFlowAndWeave=4]="SubFlowAndWeave",t[t.Arg=5]="Arg",t[t.Temp=6]="Temp";}(ft||(ft={}));var pt=function(t){a(r,t);var e=d(r);function r(t,i){var a;return n(this,r),(a=e.call(this)).variableName=t||null,a.isNewDeclaration=!!i,a.isGlobal=!1,a}return i(r,[{key:"toString",value:function(){return "VarAssign to "+this.variableName}}]),r}(V),mt=function(t){a(r,t);var e=d(r);function r(t,i,a){var o;return n(this,r),(o=e.call(this))._condition=null,o._innerContentContainer=null,o._outerContainer=null,o._runtimeChoice=null,o._returnToR1=null,o._returnToR2=null,o._r1Label=null,o._r2Label=null,o._divertToStartContentOuter=null,o._divertToStartContentInner=null,o._startContentRuntimeContainer=null,o.isInvisibleDefault=!1,o.hasWeaveStyleInlineBrackets=!1,o.GenerateRuntimeObject=function(){if(o._outerContainer=new tt,o._runtimeChoice=new ht(o.onceOnly),o._runtimeChoice.isInvisibleDefault=o.isInvisibleDefault,(o.startContent||o.choiceOnlyContent||o.condition)&&o._outerContainer.AddContent(et.EvalStart()),o.startContent){o._returnToR1=new X,o._outerContainer.AddContent(o._returnToR1);var t=new pt("$r",!0);o._outerContainer.AddContent(t),o._outerContainer.AddContent(et.BeginString()),o._divertToStartContentOuter=new vt,o._outerContainer.AddContent(o._divertToStartContentOuter),o._startContentRuntimeContainer=o.startContent.GenerateRuntimeObject(),o._startContentRuntimeContainer.name="s";var e=new vt;e.variableDivertName="$r",o._startContentRuntimeContainer.AddContent(e),o._outerContainer.AddToNamedContentOnly(o._startContentRuntimeContainer),o._r1Label=new tt,o._r1Label.name="$r1",o._outerContainer.AddContent(o._r1Label),o._outerContainer.AddContent(et.EndString()),o._runtimeChoice.hasStartContent=!0;}if(o.choiceOnlyContent){o._outerContainer.AddContent(et.BeginString());var n=o.choiceOnlyContent.GenerateRuntimeObject();o._outerContainer.AddContentsOfContainer(n),o._outerContainer.AddContent(et.EndString()),o._runtimeChoice.hasChoiceOnlyContent=!0;}if(o.condition&&(o.condition.GenerateIntoContainer(o._outerContainer),o._runtimeChoice.hasCondition=!0),(o.startContent||o.choiceOnlyContent||o.condition)&&o._outerContainer.AddContent(et.EvalEnd()),o._outerContainer.AddContent(o._runtimeChoice),o._innerContentContainer=new tt,o.startContent){o._returnToR2=new X,o._innerContentContainer.AddContent(et.EvalStart()),o._innerContentContainer.AddContent(o._returnToR2),o._innerContentContainer.AddContent(et.EvalEnd());var r=new pt("$r",!0);o._innerContentContainer.AddContent(r),o._divertToStartContentInner=new vt,o._innerContentContainer.AddContent(o._divertToStartContentInner),o._r2Label=new tt,o._r2Label.name="$r2",o._innerContentContainer.AddContent(o._r2Label);}if(o.innerContent){var i=o.innerContent.GenerateRuntimeObject();o._innerContentContainer.AddContentsOfContainer(i);}return o.story.countAllVisits&&(o._innerContentContainer.visitsShouldBeCounted=!0),o._innerContentContainer.countingAtStartOnly=!0,o._outerContainer},o.toString=function(){return null!==o.choiceOnlyContent?"* ".concat(o.startContent,"[").concat(o.choiceOnlyContent,"]..."):"* ".concat(o.startContent,"...")},o.startContent=t,o.choiceOnlyContent=i,o.innerContent=a,o.indentationDepth=1,t&&o.AddContent(o.startContent),i&&o.AddContent(o.choiceOnlyContent),a&&o.AddContent(o.innerContent),o.onceOnly=!0,o}return i(r,[{key:"runtimeChoice",get:function(){if(!this._runtimeChoice)throw new Error;return this._runtimeChoice}},{key:"name",get:function(){var t;return (null===(t=this.identifier)||void 0===t?void 0:t.name)||null}},{key:"condition",get:function(){return this._condition},set:function(t){this._condition=t,t&&this.AddContent(t);}},{key:"runtimeContainer",get:function(){return this._innerContentContainer}},{key:"innerContentContainer",get:function(){return this._innerContentContainer}},{key:"containerForCounting",get:function(){return this._innerContentContainer}},{key:"runtimePath",get:function(){if(!this.innerContentContainer||!this.innerContentContainer.path)throw new Error;return this.innerContentContainer.path}},{key:"typeName",get:function(){return "Choice"}},{key:"ResolveReferences",value:function(t){var e;if(this._innerContentContainer&&(this.runtimeChoice.pathOnChoice=this._innerContentContainer.path,this.onceOnly&&(this._innerContentContainer.visitsShouldBeCounted=!0)),this._returnToR1){if(!this._r1Label)throw new Error;this._returnToR1.targetPath=this._r1Label.path;}if(this._returnToR2){if(!this._r2Label)throw new Error;this._returnToR2.targetPath=this._r2Label.path;}if(this._divertToStartContentOuter){if(!this._startContentRuntimeContainer)throw new Error;this._divertToStartContentOuter.targetPath=this._startContentRuntimeContainer.path;}if(this._divertToStartContentInner){if(!this._startContentRuntimeContainer)throw new Error;this._divertToStartContentInner.targetPath=this._startContentRuntimeContainer.path;}p(o(r.prototype),"ResolveReferences",this).call(this,t),this.identifier&&((null===(e=this.identifier)||void 0===e?void 0:e.name)||"").length>0&&t.CheckForNamingCollisions(this,this.identifier,ft.SubFlowAndWeave);}}]),r}(W),yt=i((function t(){var e=this;n(this,t),this.characterIndex=0,this.characterInLineIndex=0,this.lineIndex=0,this.reportedErrorInScope=!1,this.uniqueId=0,this.customFlags=0,this.CopyFrom=function(n){t._uniqueIdCounter++,e.uniqueId=t._uniqueIdCounter,e.characterIndex=n.characterIndex,e.characterInLineIndex=n.characterInLineIndex,e.lineIndex=n.lineIndex,e.customFlags=n.customFlags,e.reportedErrorInScope=!1;},this.SquashFrom=function(t){e.characterIndex=t.characterIndex,e.characterInLineIndex=t.characterInLineIndex,e.lineIndex=t.lineIndex,e.reportedErrorInScope=t.reportedErrorInScope;};}));yt._uniqueIdCounter=1e3;var gt=function(){function t(){var e=this;n(this,t),this._stack=[],this._numElements=0,this.StringParserState=function(){e._stack=new Array(200);for(var t=0;t<200;++t)e._stack[t]=new yt;e._numElements=1;},this.Push=function(){if(e._numElements>=e._stack.length&&e._numElements>0)throw new Error("Stack overflow in parser state.");var t=e._stack[e._numElements-1],n=e._stack[e._numElements];return e._numElements++,n.CopyFrom(t),n.uniqueId},this.Pop=function(t){if(1==e._numElements)throw new Error("Attempting to remove final stack element is illegal! Mismatched Begin/Succceed/Fail?");if(e.currentElement.uniqueId!=t)throw new Error("Mismatched rule IDs while Poping - do you have mismatched Begin/Succeed/Fail?");e._numElements-=1;},this.Peek=function(t){if(e.currentElement.uniqueId!=t)throw new Error("Mismatched rule IDs while Peeking - do you have mismatched Begin/Succeed/Fail?");return e._stack[e._numElements-1]},this.PeekPenultimate=function(){return e._numElements>=2?e._stack[e._numElements-2]:null},this.Squash=function(){if(e._numElements<2)throw new Error("Attempting to remove final stack element is illegal! Mismatched Begin/Succceed/Fail?");var t=e._stack[e._numElements-2],n=e._stack[e._numElements-1];t.SquashFrom(n),e._numElements-=1;},this.NoteErrorReported=function(){var t,n=S(e._stack);try{for(n.s();!(t=n.n()).done;){t.value.reportedErrorInScope=!0;}}catch(t){n.e(t);}finally{n.f();}};for(var r=0;r<200;r++)this._stack[r]=new yt;this._numElements=1;}return i(t,[{key:"currentElement",get:function(){return this._stack[this._numElements-1]}},{key:"lineIndex",get:function(){return this.currentElement.lineIndex},set:function(t){this.currentElement.lineIndex=t;}},{key:"characterIndex",get:function(){return this.currentElement.characterIndex},set:function(t){this.currentElement.characterIndex=t;}},{key:"characterInLineIndex",get:function(){return this.currentElement.characterInLineIndex},set:function(t){this.currentElement.characterInLineIndex=t;}},{key:"customFlags",get:function(){return this.currentElement.customFlags},set:function(t){this.currentElement.customFlags=t;}},{key:"errorReportedAlreadyInScope",get:function(){return this.currentElement.reportedErrorInScope}},{key:"stackHeight",get:function(){return this._numElements}}]),t}(),Ct=Symbol("ParseSuccessStruct"),St=function(){function t(e){var r=this;n(this,t),this.ParseRule=null,this.errorHandler=null,this.hadError=!1,this.BeginRule=function(){return r.state.Push()},this.FailRule=function(t){return r.state.Pop(t),null},this.CancelRule=function(t){r.state.Pop(t);},this.SucceedRule=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,i=r.state.Peek(e),a=r.state.PeekPenultimate();r.RuleDidSucceed&&r.RuleDidSucceed(n,a,i),r.state.Squash();var o=n;return null===o&&(o=t.ParseSuccess),o},this.Expect=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,i=r.ParseObject(t);if(null===i){var a;null===e&&(e=t.name);var o=r.LineRemainder();a=null===o||0===o.length?"end of line":"'".concat(o,"'"),r.Error("Expected ".concat(e," but saw ").concat(a)),null!==n&&(i=n());}return i},this.Error=function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];r.ErrorOnLine(t,r.lineIndex+1,e);},this.ErrorWithParsedObject=function(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];r.ErrorOnLine(t,e.debugMetadata?e.debugMetadata.startLineNumber:-1,n);},this.ErrorOnLine=function(t,e,n){if(!r.state.errorReportedAlreadyInScope){var i=n?"Warning":"Error";if(!r.errorHandler)throw new Error("".concat(i," on line ").concat(e,": ").concat(t));r.errorHandler(t,r.index,e-1,n),r.state.NoteErrorReported();}n||(r.hadError=!0);},this.Warning=function(t){return r.Error(t,!0)},this.LineRemainder=function(){return r.Peek((function(){return r.ParseUntilCharactersFromString("\n\r")}))},this.SetFlag=function(t,e){e?r.state.customFlags|=t:r.state.customFlags&=~t;},this.GetFlag=function(t){return Boolean(r.state.customFlags&t)},this.ParseObject=function(t){var e=r.BeginRule(),n=r.state.stackHeight,i=t();if(n!==r.state.stackHeight)throw new Error("Mismatched Begin/Fail/Succeed rules");return null===i?r.FailRule(e):(r.SucceedRule(e,i),i)},this.Parse=function(t){var e=r.BeginRule(),n=t();return null===n?(r.FailRule(e),null):(r.SucceedRule(e,n),n)},this.OneOf=function(t){var e,n=S(t);try{for(n.s();!(e=n.n()).done;){var i=e.value,a=r.ParseObject(i);if(null!==a)return a}}catch(t){n.e(t);}finally{n.f();}return null},this.OneOrMore=function(t){var e=[],n=null;do{null!==(n=r.ParseObject(t))&&e.push(n);}while(null!==n);return e.length>0?e:null},this.Optional=function(e){return function(){var n=r.ParseObject(e);return null===n?t.ParseSuccess:n}},this.Exclude=function(e){return function(){return r.ParseObject(e)&&t.ParseSuccess}},this.OptionalExclude=function(e){return function(){return r.ParseObject(e),t.ParseSuccess}},this.String=function(t){return function(){return r.ParseString(t)}},this.TryAddResultToList=function(e,n){var r=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];if(e!==t.ParseSuccess){if(r&&Array.isArray(e)){var i=e;if(null!==i){var a,o=S(i);try{for(o.s();!(a=o.n()).done;){var s=a.value;n.push(s);}}catch(t){o.e(t);}finally{o.f();}return}}n.push(e);}},this.Interleave=function(e,n){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,a=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],o=r.BeginRule(),s=[],l=r.ParseObject(e);if(null===l)return r.FailRule(o);r.TryAddResultToList(l,s,a);var u=null,c=null;do{if(null!==i&&null!==r.Peek(i))break;if(null===(u=r.ParseObject(n)))break;if(r.TryAddResultToList(u,s,a),c=null,null!==u){if(null===(c=r.ParseObject(e)))break;r.TryAddResultToList(c,s,a);}}while((null!==u||null!==c)&&(u!==t.ParseSuccess||c!=t.ParseSuccess)&&r.remainingLength>0);return 0===s.length?r.FailRule(o):r.SucceedRule(o,s)},this.ParseString=function(t){if(t.length>r.remainingLength)return null;for(var e=r.BeginRule(),n=r.index,i=r.characterInLineIndex,a=r.lineIndex,o=!0,s=0;s<t.length;s+=1){var l=t[s];if(r._chars[n]!==l){o=!1;break}"\n"===l&&(a++,i=-1),n++,i++;}return r.index=n,r.characterInLineIndex=i,r.lineIndex=a,o?r.SucceedRule(e,t):r.FailRule(e)},this.ParseSingleCharacter=function(){if(r.remainingLength>0){var t=r._chars[r.index];return "\n"===t&&(r.lineIndex+=1,r.characterInLineIndex=-1),r.index+=1,r.characterInLineIndex+=1,t}return "0"},this.ParseUntilCharactersFromString=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1;return r.ParseCharactersFromString(t,!1,e)},this.ParseUntilCharactersFromCharSet=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1;return r.ParseCharactersFromCharSet(t,!1,e)},this.ParseCharactersFromString=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:-1,i=new lt(t);return "number"==typeof e?r.ParseCharactersFromCharSet(i,!0,e):r.ParseCharactersFromCharSet(i,e,n)},this.ParseCharactersFromCharSet=function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:-1;-1===n&&(n=Number.MAX_SAFE_INTEGER);for(var i=r.index,a=r.index,o=r.characterInLineIndex,s=r.lineIndex,l=0;a<r._chars.length&&t.set.has(r._chars[a])===e&&l<n;)"\n"===r._chars[a]&&(s+=1,o=-1),a+=1,o+=1,l+=1;r.index=a,r.characterInLineIndex=o,r.lineIndex=s;var u=r.index;return u>i?r._chars.slice(i,r.index).join(""):null},this.Peek=function(t){var e=r.BeginRule(),n=t();return r.CancelRule(e),n},this.ParseInt=function(){var e=r.index,n=r.characterInLineIndex,i=null!==r.ParseString("-");r.ParseCharactersFromString(" \t");var a,o=r.ParseCharactersFromCharSet(t.numbersCharacterSet);return null===o?(r.index=e,r.characterInLineIndex=n,null):Number.isNaN(Number(o))?(r.Error("Failed to read integer value: "+o+". Perhaps it's out of the range of acceptable numbers ink supports? ("+Number.MIN_SAFE_INTEGER+" to "+Number.MAX_SAFE_INTEGER+")"),null):(a=Number(o),i?-a:a)},this.ParseFloat=function(){var e=r.index,n=r.characterInLineIndex,i=r.ParseInt();if(null!==i&&null!==r.ParseString(".")){var a=r.ParseCharactersFromCharSet(t.numbersCharacterSet);return Number("".concat(i,".").concat(a))}return r.index=e,r.characterInLineIndex=n,null},this.ParseNewline=function(){var t=r.BeginRule();return r.ParseString("\r"),null===r.ParseString("\n")?r.FailRule(t):r.SucceedRule(t,"\n")};var i=this.PreProcessInputString(e);this.state=new gt,this._chars=e?i.split(""):[],this.inputString=i;}return i(t,[{key:"currentCharacter",get:function(){return this.index>=0&&this.remainingLength>0?this._chars[this.index]:"0"}},{key:"PreProcessInputString",value:function(t){return t}},{key:"endOfInput",get:function(){return this.index>=this._chars.length}},{key:"remainingString",get:function(){return this._chars.slice(this.index,this.index+this.remainingLength).join("")}},{key:"remainingLength",get:function(){return this._chars.length-this.index}},{key:"lineIndex",get:function(){return this.state.lineIndex},set:function(t){this.state.lineIndex=t;}},{key:"characterInLineIndex",get:function(){return this.state.characterInLineIndex},set:function(t){this.state.characterInLineIndex=t;}},{key:"index",get:function(){return this.state.characterIndex},set:function(t){this.state.characterIndex=t;}},{key:"ParseUntil",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,r=this.BeginRule(),i=new lt;null!==e&&(i.set=new Set([].concat(y(i.set.values()),y(e.set.values())))),null!==n&&(i.set=new Set([].concat(y(i.set.values()),y(n.set.values()))));for(var a="";;){var o=this.ParseUntilCharactersFromCharSet(i);if(o&&(a+=o),null!==this.Peek(t))break;if(this.endOfInput)break;var s=this.currentCharacter;if(null===e||!e.set.has(s))break;a+=s,"\n"===s&&(this.lineIndex+=1,this.characterInLineIndex=-1),this.index+=1,this.characterInLineIndex+=1;}return a.length>0?this.SucceedRule(r,String(a)):this.FailRule(r)}}]),t}();St.ParseSuccess=Ct,St.numbersCharacterSet=new lt("0123456789");var bt,wt=function(t){a(r,t);var e=d(r);function r(){var t;return n(this,r),(t=e.apply(this,arguments))._commentOrNewlineStartCharacter=new lt("/\r\n"),t._commentBlockEndCharacter=new lt("*"),t._newlineCharacters=new lt("\n\r"),t.Process=function(){var e=t.Interleave(t.Optional(t.CommentsAndNewlines),t.Optional(t.MainInk));return null!==e?e.join(""):""},t.MainInk=function(){return t.ParseUntil(t.CommentsAndNewlines,t._commentOrNewlineStartCharacter,null)},t.CommentsAndNewlines=function(){var e=t.Interleave(t.Optional(t.ParseNewline),t.Optional(t.ParseSingleComment));return null!==e?e.join(""):null},t.ParseSingleComment=function(){return t.OneOf([t.EndOfLineComment,t.BlockComment])},t.EndOfLineComment=function(){return null===t.ParseString("//")?null:(t.ParseUntilCharactersFromCharSet(t._newlineCharacters),"")},t.BlockComment=function(){if(null===t.ParseString("/*"))return null;var e=t.lineIndex,n=t.ParseUntil(t.String("*/"),t._commentBlockEndCharacter,null);return t.endOfInput||t.ParseString("*/"),null!=n?"\n".repeat(t.lineIndex-e):null},t}return i(r,[{key:"PreProcessInputString",value:function(t){return t}}]),r}(St),kt=function(t){a(r,t);var e=d(r);function r(t,i){var a;return n(this,r),(a=e.call(this)).initialCondition=t,a.branches=i,a._reJoinTarget=null,a.GenerateRuntimeObject=function(){var t=new tt;a.initialCondition&&t.AddContent(a.initialCondition.runtimeObject);var e,n=S(a.branches);try{for(n.s();!(e=n.n()).done;){var r=e.value.runtimeObject;t.AddContent(r);}}catch(t){n.e(t);}finally{n.f();}return null===a.initialCondition||null===a.branches[0].ownExpression||a.branches[a.branches.length-1].isElse||t.AddContent(et.PopEvaluatedValue()),a._reJoinTarget=et.NoOp(),t.AddContent(a._reJoinTarget),t},a.initialCondition&&a.AddContent(a.initialCondition),null!==a.branches&&a.AddContent(a.branches),a}return i(r,[{key:"typeName",get:function(){return "Conditional"}},{key:"ResolveReferences",value:function(t){var e,n=this._reJoinTarget.path,i=S(this.branches);try{for(i.s();!(e=i.n()).done;){var a=e.value;if(!a.returnDivert)throw new Error;a.returnDivert.targetPath=n;}}catch(t){i.e(t);}finally{i.f();}p(o(r.prototype),"ResolveReferences",this).call(this,t);}}]),r}(W),Et=function(t){a(r,t);var e=d(r);function r(t){var i;return n(this,r),(i=e.call(this)).text=t,i.GenerateRuntimeObject=function(){return new $(i.text)},i.toString=function(){return i.text},i}return i(r,[{key:"typeName",get:function(){return "Text"}}]),r}(W),_t=function(t){a(r,t);var e=d(r);function r(t,i){var a;return n(this,r),(a=e.call(this))._expression=null,a.GenerateRuntimeObject=function(){return null},a.constantIdentifier=t,i&&(a._expression=a.AddContent(i)),a}return i(r,[{key:"constantName",get:function(){var t;return null===(t=this.constantIdentifier)||void 0===t?void 0:t.name}},{key:"expression",get:function(){if(!this._expression)throw new Error;return this._expression}},{key:"typeName",get:function(){return "CONST"}},{key:"ResolveReferences",value:function(t){p(o(r.prototype),"ResolveReferences",this).call(this,t),t.CheckForNamingCollisions(this,this.constantIdentifier,ft.Var);}}]),r}(W);!function(t){t[t.Story=0]="Story",t[t.Knot=1]="Knot",t[t.Stitch=2]="Stitch",t[t.WeavePoint=3]="WeavePoint";}(bt||(bt={}));var At=function(t){a(r,t);var e=d(r);function r(t,i){var a;return n(this,r),(a=e.call(this)).indentationDepth=i,a.GenerateRuntimeObject=function(){var t=new tt;if(t.name=a.name,a.story.countAllVisits&&(t.visitsShouldBeCounted=!0),t.countingAtStartOnly=!0,a.content){var e,n=S(a.content);try{for(n.s();!(e=n.n()).done;){var r=e.value;t.AddContent(r.runtimeObject);}}catch(t){n.e(t);}finally{n.f();}}return t},a.toString=function(){var t,e;return "- ".concat((null===(t=a.identifier)||void 0===t?void 0:t.name)?"("+(null===(e=a.identifier)||void 0===e?void 0:e.name)+")":"gather")},t&&(a.identifier=t),a}return i(r,[{key:"name",get:function(){var t;return (null===(t=this.identifier)||void 0===t?void 0:t.name)||null}},{key:"runtimeContainer",get:function(){return this.runtimeObject}},{key:"typeName",get:function(){return "Gather"}},{key:"ResolveReferences",value:function(t){p(o(r.prototype),"ResolveReferences",this).call(this,t),this.identifier&&(this.identifier.name||"").length>0&&t.CheckForNamingCollisions(this,this.identifier,ft.SubFlowAndWeave);}}]),r}(W),Tt=function(){function t(e,r){var i=this;n(this,t),this._dotSeparatedComponents=null,this.toString=function(){return null===i.components||0===i.components.length?i.baseTargetLevel===bt.WeavePoint?"-> <next gather point>":"<invalid Path>":"-> ".concat(i.dotSeparatedComponents)},this.ResolveFromContext=function(t){if(null==i.components||0==i.components.length)return null;var e=i.ResolveBaseTarget(t);return null===e?null:i.components.length>1?i.ResolveTailComponents(e):e},this.ResolveBaseTarget=function(t){for(var e=i.firstComponent,n=t;n;){var r=n===t,a=i.GetChildFromContext(n,e,null,r);if(a)return a;n=n.parent;}return null},this.ResolveTailComponents=function(t){var e=t;if(!i.components)return null;for(var n=1;n<i.components.length;++n){var r=i.components[n].name,a=void 0,o=_(e,Ot);if(a=null!==o?o.flowLevel+1:bt.WeavePoint,null===(e=i.GetChildFromContext(e,r,a)))break}return e},this.GetChildFromContext=function(t,e,n){var r=arguments.length>3&&void 0!==arguments[3]&&arguments[3],i=null===n,a=_(t,zt);if(e&&null!==a&&(i||n===bt.WeavePoint))return a.WeavePointNamed(e);var o=_(t,Ot);if(e&&null!==o){var s=r||o.flowLevel===bt.Knot;return o.ContentWithNameAtLevel(e,n,s)}return null},Object.values(bt).includes(e)?(this._baseTargetLevel=e,this.components=r||[]):Array.isArray(e)?(this._baseTargetLevel=null,this.components=e||[]):(this._baseTargetLevel=null,this.components=[e]);}return i(t,[{key:"baseTargetLevel",get:function(){return this.baseLevelIsAmbiguous?bt.Story:this._baseTargetLevel}},{key:"baseLevelIsAmbiguous",get:function(){return !this._baseTargetLevel}},{key:"firstComponent",get:function(){return null!=this.components&&this.components.length?this.components[0].name:null}},{key:"numberOfComponents",get:function(){return this.components?this.components.length:0}},{key:"dotSeparatedComponents",get:function(){return null==this._dotSeparatedComponents&&(this._dotSeparatedComponents=(this.components?this.components:[]).map((function(t){return t.name})).filter(O).join(".")),this._dotSeparatedComponents}},{key:"typeName",get:function(){return "Path"}}]),t}(),Pt=function(t){a(r,t);var e=d(r);function r(){var t,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;return n(this,r),(t=e.call(this)).returnedExpression=null,t.GenerateRuntimeObject=function(){var e=new tt;return t.returnedExpression?e.AddContent(t.returnedExpression.runtimeObject):(e.AddContent(et.EvalStart()),e.AddContent(new rt),e.AddContent(et.EvalEnd())),e.AddContent(et.PopFunction()),e},i&&(t.returnedExpression=t.AddContent(i)),t}return i(r,[{key:"typeName",get:function(){return "ReturnType"}}]),r}(W);function xt(t){for(var e=t.parent;e;){if(e.hasOwnProperty("iamFlowbase")&&e.iamFlowbase())return e;e=e.parent;}return null}var Nt=function(){function t(e){var r=this;n(this,t),this.debugMetadata=null,this.toString=function(){return r.name||"undefined identifer"},this.name=e;}return i(t,[{key:"typeName",get:function(){return "Identifier"}}],[{key:"Done",value:function(){return new t("DONE")}}]),t}(),Ot=function(t){a(r,t);var e=d(r);function r(t){var i,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,s=arguments.length>3&&void 0!==arguments[3]&&arguments[3],l=arguments.length>4&&void 0!==arguments[4]&&arguments[4];return n(this,r),(i=e.call(this)).isFunction=s,i._rootWeave=null,i._subFlowsByName=new Map,i._startingSubFlowDivert=null,i._startingSubFlowRuntime=null,i._firstChildFlow=null,i.variableDeclarations=new Map,i.identifier=null,i.args=null,i.iamFlowbase=function(){return !0},i.SplitWeaveAndSubFlowContent=function(t,e){var n,a,o=[],s=[];i._subFlowsByName=new Map;var l,u=S(t);try{for(u.s();!(l=u.n()).done;){var c=l.value,h=_(c,r);h?(null===i._firstChildFlow&&(i._firstChildFlow=h),s.push(c),(null===(n=h.identifier)||void 0===n?void 0:n.name)&&i._subFlowsByName.set(null===(a=h.identifier)||void 0===a?void 0:a.name,h)):o.push(c);}}catch(t){u.e(t);}finally{u.f();}e&&o.push(new At(null,1),new jt(new Tt(Nt.Done())));var f=[];return o.length>0&&(i._rootWeave=new zt(o,0),f.push(i._rootWeave)),s.length>0&&f.push.apply(f,s),f},i.ResolveVariableWithName=function(t,e){var n,r={},a=null===e?h(i):xt(e);if(a){if(null!==a.args){var o,s=S(a.args);try{for(s.s();!(o=s.n()).done;){if((null===(n=o.value.identifier)||void 0===n?void 0:n.name)===t)return r.found=!0,r.isArgument=!0,r.ownerFlow=a,r}}catch(t){s.e(t);}finally{s.f();}}if(a!==i.story&&a.variableDeclarations.has(t))return r.found=!0,r.ownerFlow=a,r.isTemporary=!0,r}return i.story.variableDeclarations.has(t)?(r.found=!0,r.ownerFlow=i.story,r.isGlobal=!0,r):(r.found=!1,r)},i.AddNewVariableDeclaration=function(t){var e=t.variableName;if(i.variableDeclarations.has(e)){var n=i.variableDeclarations.get(e),r="";return n.debugMetadata&&(r=" (".concat(n.debugMetadata,")")),void i.Error("found declaration variable '".concat(e,"' that was already declared").concat(r),t,!1)}i.variableDeclarations.set(t.variableName,t);},i.ResolveWeavePointNaming=function(){i._rootWeave&&i._rootWeave.ResolveWeavePointNaming();var t,e=S(i._subFlowsByName);try{for(e.s();!(t=e.n()).done;){var n=m(t.value,2)[1];n.hasOwnProperty("ResolveWeavePointNaming")&&n.ResolveWeavePointNaming();}}catch(t){e.e(t);}finally{e.f();}},i.GenerateRuntimeObject=function(){var t,e=null;i.isFunction?i.CheckForDisallowedFunctionFlowControl():i.flowLevel!==bt.Knot&&i.flowLevel!==bt.Stitch||null!==(e=i.Find(Pt)())&&i.Error("Return statements can only be used in knots that are declared as functions: == function ".concat(i.identifier," =="),e);var n=new tt;n.name=null===(t=i.identifier)||void 0===t?void 0:t.name,i.story.countAllVisits&&(n.visitsShouldBeCounted=!0),i.GenerateArgumentVariableAssignments(n);for(var a=0;null!==i.content&&a<i.content.length;){var o=i.content[a];if(o instanceof r){var s=o,l=s.runtimeObject;0!==a||s.hasParameters||i.flowLevel!==bt.Knot||(i._startingSubFlowDivert=new vt,n.AddContent(i._startingSubFlowDivert),i._startingSubFlowRuntime=l);var u=l,c=n.namedContent.get(u.name)||null;if(c){var h="".concat(i.GetType()," already contains flow named '").concat(u.name,"' (at ").concat(c.debugMetadata,")");i.Error(h,s);}n.AddToNamedContentOnly(u);}else o&&n.AddContent(o.runtimeObject);a+=1;}return i.flowLevel===bt.Story||i.isFunction||null===i._rootWeave||null!==e||i._rootWeave.ValidateTermination(i.WarningInTermination),n},i.GenerateArgumentVariableAssignments=function(t){var e;if(null!==i.args&&0!==i.args.length)for(var n=i.args.length-1;n>=0;--n){var r=(null===(e=i.args[n].identifier)||void 0===e?void 0:e.name)||null,a=new pt(r,!0);t.AddContent(a);}},i.ContentWithNameAtLevel=function(t){var e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,r=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if((n===i.flowLevel||null===n)&&t===(null===(e=i.identifier)||void 0===e?void 0:e.name))return h(i);if(n===bt.WeavePoint||null===n){var a=null;if(i._rootWeave&&(a=i._rootWeave.WeavePointNamed(t)))return a;if(n===bt.WeavePoint)return r?i.DeepSearchForAnyLevelContent(t):null}if(null!==n&&n<i.flowLevel)return null;var o=i._subFlowsByName.get(t)||null;return !o||null!==n&&n!==o.flowLevel?r?i.DeepSearchForAnyLevelContent(t):null:o},i.DeepSearchForAnyLevelContent=function(t){var e=i.ContentWithNameAtLevel(t,bt.WeavePoint,!1);if(e)return e;var n,r=S(i._subFlowsByName);try{for(r.s();!(n=r.n()).done;){var a=m(n.value,2)[1].ContentWithNameAtLevel(t,null,!0);if(a)return a}}catch(t){r.e(t);}finally{r.f();}return null},i.CheckForDisallowedFunctionFlowControl=function(){i.flowLevel!==bt.Knot&&i.Error("Functions cannot be stitches - i.e. they should be defined as '== function myFunc ==' rather than internal to another knot.");var t,e=S(i._subFlowsByName);try{for(e.s();!(t=e.n()).done;){var n=m(t.value,2),r=n[0],a=n[1];i.Error("Functions may not contain stitches, but saw '".concat(r,"' within the function '").concat(i.identifier,"'"),a);}}catch(t){e.e(t);}finally{e.f();}if(!i._rootWeave)throw new Error;var o,s=S(i._rootWeave.FindAll(jt)());try{for(s.s();!(o=s.n()).done;){var l=o.value;l.isFunctionCall||l.parent instanceof Vt||i.Error("Functions may not contain diverts, but saw '".concat(l,"'"),l);}}catch(t){s.e(t);}finally{s.f();}var u,c=S(i._rootWeave.FindAll(mt)());try{for(c.s();!(u=c.n()).done;){var h=u.value;i.Error("Functions may not contain choices, but saw '".concat(h,"'"),h);}}catch(t){c.e(t);}finally{c.f();}},i.WarningInTermination=function(t){var e="Apparent loose end exists where the flow runs out. Do you need a '-> DONE' statement, choice or divert?";t.parent===i._rootWeave&&i._firstChildFlow&&(e="".concat(e," Note that if you intend to enter '").concat(i._firstChildFlow.identifier,"' next, you need to divert to it explicitly."));var n=_(t,jt);n&&n.isTunnel&&(e+=" When final tunnel to '".concat(n.target," ->' returns it won't have anywhere to go.")),i.Warning(e,t);},i.toString=function(){return "".concat(i.typeName," '").concat(i.identifier,"'")},i.identifier=t,i.args=o,null===a&&(a=[]),i.PreProcessTopLevelObjects(a),a=i.SplitWeaveAndSubFlowContent(a,"Story"==i.GetType()&&!l),i.AddContent(a),i}return i(r,[{key:"hasParameters",get:function(){return null!==this.args&&this.args.length>0}},{key:"subFlowsByName",get:function(){return this._subFlowsByName}},{key:"typeName",get:function(){return this.isFunction?"Function":String(this.flowLevel)}},{key:"name",get:function(){var t;return (null===(t=this.identifier)||void 0===t?void 0:t.name)||null}},{key:"PreProcessTopLevelObjects",value:function(t){}},{key:"ResolveReferences",value:function(t){var e,n;if(this._startingSubFlowDivert){if(!this._startingSubFlowRuntime)throw new Error;this._startingSubFlowDivert.targetPath=this._startingSubFlowRuntime.path;}if(p(o(r.prototype),"ResolveReferences",this).call(this,t),null!==this.args){var i,a=S(this.args);try{for(a.s();!(i=a.n()).done;){var s=i.value;t.CheckForNamingCollisions(this,s.identifier,ft.Arg,"argument");}}catch(t){a.e(t);}finally{a.f();}for(var l=0;l<this.args.length;l+=1)for(var u=l+1;u<this.args.length;u+=1)(null===(e=this.args[l].identifier)||void 0===e?void 0:e.name)==(null===(n=this.args[u].identifier)||void 0===n?void 0:n.name)&&this.Error("Multiple arguments with the same name: '".concat(this.args[l].identifier,"'"));}if(this.flowLevel!==bt.Story){var c=this.flowLevel===bt.Knot?ft.Knot:ft.SubFlowAndWeave;t.CheckForNamingCollisions(this,this.identifier,c);}}}]),r}(W),It=function(t){a(r,t);var e=d(r);function r(t){var i;n(this,r),(i=e.call(this)).dontFlatten=!1,i.TrimTrailingWhitespace=function(){for(var t=i.content.length-1;t>=0;--t){var e=_(i.content[t],Et);if(null===e)break;if(e.text=e.text.replace(new RegExp(/[ \t]/g),""),0!==e.text.length)break;i.content.splice(t,1);}},i.GenerateRuntimeObject=function(){var t=new tt;if(null!==i.content){var e,n=S(i.content);try{for(n.s();!(e=n.n()).done;){var r=e.value.runtimeObject;r&&t.AddContent(r);}}catch(t){n.e(t);}finally{n.f();}}return i.dontFlatten&&i.story.DontFlattenContainer(t),t},i.toString=function(){return "ContentList(".concat(i.content.join(", "),")")},t&&i.AddContent(t);for(var a=arguments.length,o=new Array(a>1?a-1:0),s=1;s<a;s++)o[s-1]=arguments[s];return o&&i.AddContent(o),i}return i(r,[{key:"runtimeContainer",get:function(){return this.runtimeObject}},{key:"typeName",get:function(){return "ContentList"}}]),r}(W),Wt=function(t){a(r,t);var e=d(r);function r(){var t,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;return n(this,r),(t=e.call(this)).pathForCount=null,t.name=i,t}return i(r,[{key:"containerForCount",get:function(){return null===this.pathForCount?null:this.ResolvePath(this.pathForCount).container}},{key:"pathStringForCount",get:function(){return null===this.pathForCount?null:this.CompactPathString(this.pathForCount)},set:function(t){this.pathForCount=null===t?null:new R(t);}},{key:"toString",value:function(){return null!=this.name?"var("+this.name+")":"read_count("+this.pathStringForCount+")"}}]),r}(V),Ft=function(t){a(r,t);var e=d(r);function r(t){var i;return n(this,r),(i=e.call(this)).pathIdentifiers=t,i._runtimeVarRef=null,i.isConstantReference=!1,i.isListItemReference=!1,i.GenerateIntoContainer=function(t){var e=i.story.constants.get(i.name);if(e)return e.GenerateConstantIntoContainer(t),void(i.isConstantReference=!0);if(i._runtimeVarRef=new Wt(i.name),1===i.path.length||2===i.path.length){var n="",r="";1===i.path.length?n=i.path[0]:(r=i.path[0],n=i.path[1]),i.story.ResolveListItem(r,n,h(i))&&(i.isListItemReference=!0);}t.AddContent(i._runtimeVarRef);},i.toString=function(){return "{".concat(i.path.join("."),"}")},i}return i(r,[{key:"name",get:function(){return this.path.join(".")}},{key:"path",get:function(){return this.pathIdentifiers.map((function(t){return t.name})).filter(O)}},{key:"identifier",get:function(){if(!this.pathIdentifiers||0==this.pathIdentifiers.length)return null;var t=this.path.join(".");return new Nt(t)}},{key:"runtimeVarRef",get:function(){return this._runtimeVarRef}},{key:"typeName",get:function(){return "ref"}},{key:"ResolveReferences",value:function(t){if(p(o(r.prototype),"ResolveReferences",this).call(this,t),!this.isConstantReference&&!this.isListItemReference){var e=new Tt(this.pathIdentifiers),n=e.ResolveFromContext(this);if(n){if(!n.containerForCounting)throw new Error;if(n.containerForCounting.visitsShouldBeCounted=!0,null===this._runtimeVarRef)return;this._runtimeVarRef.pathForCount=n.runtimePath,this._runtimeVarRef.name=null;var i=_(n,Ot);i&&i.isFunction&&(this.parent instanceof zt||this.parent instanceof It||this.parent instanceof Ot)&&this.Warning("'".concat(i.identifier,"' being used as read count rather than being called as function. Perhaps you intended to write ").concat(i.identifier,"()"));}else {if(this.path.length>1){var a="Could not find target for read count: ".concat(e);return this.path.length<=2&&(a+=", or couldn't find list item with the name ".concat(this.path.join(","))),void this.Error(a)}t.ResolveVariableWithName(this.name,this).found||this.Error("Unresolved variable: ".concat(this.name),this);}}}}]),r}(nt),Rt=function(t){a(r,t);var e=d(r);function r(t,i){var a;return n(this,r),(a=e.call(this))._divertTargetToCount=null,a._variableReferenceToCount=null,a.shouldPopReturnedValue=!1,a.GenerateIntoContainer=function(t){var e=a.story.ResolveList(a.name),n=!1;if(a.isChoiceCount)a.args.length>0&&a.Error("The CHOICE_COUNT() function shouldn't take any arguments"),t.AddContent(et.ChoiceCount());else if(a.isTurns)a.args.length>0&&a.Error("The TURNS() function shouldn't take any arguments"),t.AddContent(et.Turns());else if(a.isTurnsSince||a.isReadCount){var r=_(a.args[0],Vt),i=_(a.args[0],Ft);if(1!==a.args.length||null===r&&null===i)return void a.Error("The ".concat(a.name,"() function should take one argument: a divert target to the target knot, stitch, gather or choice you want to check. e.g. TURNS_SINCE(-> myKnot)"));r?(a._divertTargetToCount=r,a.AddContent(a._divertTargetToCount),a._divertTargetToCount.GenerateIntoContainer(t)):i&&(a._variableReferenceToCount=i,a.AddContent(a._variableReferenceToCount),a._variableReferenceToCount.GenerateIntoContainer(t)),a.isTurnsSince?t.AddContent(et.TurnsSince()):t.AddContent(et.ReadCount());}else if(a.isRandom){2!==a.args.length&&a.Error("RANDOM should take 2 parameters: a minimum and a maximum integer");for(var o=0;o<a.args.length;o+=1){var s=_(a.args[o],at);if(s&&!s.isInt()){var l=0===o?"minimum":"maximum";a.Error("RANDOM's ".concat(l," parameter should be an integer"));}a.args[o].GenerateIntoContainer(t);}t.AddContent(et.Random());}else if(a.isSeedRandom){1!==a.args.length&&a.Error("SEED_RANDOM should take 1 parameter - an integer seed");var u=_(a.args[0],at);u&&!u.isInt()&&a.Error("SEED_RANDOM's parameter should be an integer seed"),a.args[0].GenerateIntoContainer(t),t.AddContent(et.SeedRandom());}else if(a.isListRange){3!==a.args.length&&a.Error("LIST_RANGE should take 3 parameters - a list, a min and a max");for(var c=0;c<a.args.length;c+=1)a.args[c].GenerateIntoContainer(t);t.AddContent(et.ListRange());}else if(a.isListRandom)1!==a.args.length&&a.Error("LIST_RANDOM should take 1 parameter - a list"),a.args[0].GenerateIntoContainer(t),t.AddContent(et.ListRandom());else if(it.CallExistsWithName(a.name)){var h=it.CallWithName(a.name);if(h.numberOfParameters!==a.args.length){var f="".concat(name," should take ").concat(h.numberOfParameters," parameter");h.numberOfParameters>1&&(f+="s"),a.Error(f);}for(var d=0;d<a.args.length;d+=1)a.args[d].GenerateIntoContainer(t);t.AddContent(it.CallWithName(a.name));}else if(null!==e)if(a.args.length>1&&a.Error("Can currently only construct a list from one integer (or an empty list from a given list definition)"),1===a.args.length)t.AddContent(new $(a.name)),a.args[0].GenerateIntoContainer(t),t.AddContent(et.ListFromInt());else {var v=new B;v.SetInitialOriginName(a.name),t.AddContent(new Z(v));}else t.AddContent(a._proxyDivert.runtimeObject),n=!0;n||a.content.splice(a.content.indexOf(a._proxyDivert),1),a.shouldPopReturnedValue&&t.AddContent(et.PopEvaluatedValue());},a.toString=function(){var t=a.args.join(", ");return "".concat(a.name,"(").concat(t,")")},a._proxyDivert=new jt(new Tt(t),i),a._proxyDivert.isFunctionCall=!0,a.AddContent(a._proxyDivert),a}return i(r,[{key:"proxyDivert",get:function(){return this._proxyDivert}},{key:"name",get:function(){return this._proxyDivert.target.firstComponent||""}},{key:"args",get:function(){return this._proxyDivert.args}},{key:"runtimeDivert",get:function(){return this._proxyDivert.runtimeDivert}},{key:"isChoiceCount",get:function(){return "CHOICE_COUNT"===this.name}},{key:"isTurns",get:function(){return "TURNS"===this.name}},{key:"isTurnsSince",get:function(){return "TURNS_SINCE"===this.name}},{key:"isRandom",get:function(){return "RANDOM"===this.name}},{key:"isSeedRandom",get:function(){return "SEED_RANDOM"===this.name}},{key:"isListRange",get:function(){return "LIST_RANGE"===this.name}},{key:"isListRandom",get:function(){return "LIST_RANDOM"===this.name}},{key:"isReadCount",get:function(){return "READ_COUNT"===this.name}},{key:"typeName",get:function(){return "FunctionCall"}},{key:"ResolveReferences",value:function(t){if(p(o(r.prototype),"ResolveReferences",this).call(this,t),!this.content.includes(this._proxyDivert)&&null!==this.args){var e,n=S(this.args);try{for(n.s();!(e=n.n()).done;){e.value.ResolveReferences(t);}}catch(t){n.e(t);}finally{n.f();}}if(this._divertTargetToCount){var i=this._divertTargetToCount.divert,a=null!=i.runtimeDivert.variableDivertName;if(a)return void this.Error("When getting the TURNS_SINCE() of a variable target, remove the '->' - i.e. it should just be TURNS_SINCE(".concat(i.runtimeDivert.variableDivertName,")"));var s=i.targetContent;if(null===s)a||this.Error("Failed to find target for TURNS_SINCE: '".concat(i.target,"'"));else {if(!s.containerForCounting)throw new Error;s.containerForCounting.turnIndexShouldBeCounted=!0;}}else if(this._variableReferenceToCount){var l=this._variableReferenceToCount.runtimeVarRef;if(!l)throw new Error;null!==l.pathForCount&&this.Error("Should be '".concat(name,"'(-> '").concat(this._variableReferenceToCount.name,"). Usage without the '->' only makes sense for variable targets."));}}}]),r}(nt);Rt.IsBuiltIn=function(t){return !!it.CallExistsWithName(t)||("CHOICE_COUNT"===t||"TURNS_SINCE"===t||"TURNS"===t||"RANDOM"===t||"SEED_RANDOM"===t||"LIST_VALUE"===t||"LIST_RANDOM"===t||"READ_COUNT"===t)};var Dt,Lt=function(t){a(r,t);var e=d(r);function r(t){var i;return n(this,r),(i=e.call(this)).GenerateIntoContainer=function(t){var e,n=!0,r=S(i.subExpressions);try{for(r.s();!(e=r.n()).done;){e.value.GenerateIntoContainer(t),n||t.AddContent(it.CallWithName("&&")),n=!1;}}catch(t){r.e(t);}finally{r.f();}},i.AddContent(t),i}return i(r,[{key:"subExpressions",get:function(){return this.content}},{key:"typeName",get:function(){return "MultipleConditionExpression"}}]),r}(nt),Vt=function(t){a(r,t);var e=d(r);function r(t){var i;return n(this,r),(i=e.call(this))._runtimeDivert=null,i._runtimeDivertTargetValue=null,i.GenerateIntoContainer=function(t){i.divert.GenerateRuntimeObject(),i._runtimeDivert=i.divert.runtimeDivert,i._runtimeDivertTargetValue=new X,t.AddContent(i.runtimeDivertTargetValue);},i.Equals=function(t){var e=_(t,r);return !!(e&&i.divert.target&&e.divert.target)&&i.divert.target.dotSeparatedComponents===e.divert.target.dotSeparatedComponents},i.divert=i.AddContent(t),i}return i(r,[{key:"runtimeDivert",get:function(){if(!this._runtimeDivert)throw new Error;return this._runtimeDivert}},{key:"runtimeDivertTargetValue",get:function(){if(!this._runtimeDivertTargetValue)throw new Error;return this._runtimeDivertTargetValue}},{key:"typeName",get:function(){return "DivertTarget"}},{key:"ResolveReferences",value:function(t){if(p(o(r.prototype),"ResolveReferences",this).call(this,t),this.divert.isDone||this.divert.isEnd)this.Error("Can't use -> DONE or -> END as variable divert targets",this);else {for(var e=this;e&&e instanceof nt;){var n=!1,i=!1,a=e.parent;if(a instanceof st){var s=a;"=="!==s.opName&&"!="!==s.opName?n=!0:(s.leftExpression instanceof r||s.leftExpression instanceof Ft)&&(s.rightExpression instanceof r||s.rightExpression instanceof Ft)||(n=!0),i=!0;}else if(a instanceof Rt){var l=a;l.isTurnsSince||l.isReadCount||(n=!0),i=!0;}else (a instanceof nt||a instanceof Lt||a instanceof mt&&a.condition===e||a instanceof kt||a instanceof $t)&&(n=!0,i=!0);if(n&&this.Error("Can't use a divert target like that. Did you intend to call '".concat(this.divert.target,"' as a function: likeThis(), or check the read count: likeThis, with no arrows?"),this),i)break;e=a;}if(this.runtimeDivert.hasVariableTarget){if(!this.divert.target)throw new Error;this.Error("Since '".concat(this.divert.target.dotSeparatedComponents,"' is a variable, it shouldn't be preceded by '->' here."));}this.runtimeDivert.targetPath&&(this.runtimeDivertTargetValue.targetPath=this.runtimeDivert.targetPath);var u=this.divert.targetContent;if(null!==u){var c=u.containerForCounting;if(null!==c){var h=_(this.parent,Rt);h&&h.isTurnsSince||(c.visitsShouldBeCounted=!0),c.turnIndexShouldBeCounted=!0;}var f=_(u,Ot);if(null!=f&&null!==f.args){var d,v=S(f.args);try{for(v.s();!(d=v.n()).done;){var m=d.value;m.isByReference&&this.Error("Can't store a divert target to a knot or function that has by-reference arguments ('".concat(f.identifier,"' has 'ref ").concat(m.identifier,"')."));}}catch(t){v.e(t);}finally{v.f();}}}}}}]),r}(nt),jt=function(t){a(r,t);var e=d(r);function r(t,i){var a;return n(this,r),(a=e.call(this)).args=[],a.target=null,a.targetContent=null,a._runtimeDivert=null,a.isFunctionCall=!1,a.isEmpty=!1,a.isTunnel=!1,a.isThread=!1,a.GenerateRuntimeObject=function(){if(a.isEnd)return et.End();if(a.isDone)return et.Done();a.runtimeDivert=new vt,a.ResolveTargetContent(),a.CheckArgumentValidity();var t=null!==a.args&&a.args.length>0;if(t||a.isFunctionCall||a.isTunnel||a.isThread){var e=new tt;if(t){a.isFunctionCall||e.AddContent(et.EvalStart());var n=null;a.targetContent&&(n=a.targetContent.args);for(var r=0;r<a.args.length;++r){var i=a.args[r],o=null;if(n&&r<n.length&&(o=n[r]),o&&o.isByReference){var s=_(i,Ft);if(!s){a.Error("Expected variable name to pass by reference to 'ref ".concat(o.identifier,"' but saw ").concat(i));break}var l=new Tt(s.pathIdentifiers);if(l.ResolveFromContext(h(a))){a.Error("can't pass a read count by reference. '".concat(l.dotSeparatedComponents,"' is a knot/stitch/label, but '").concat(a.target.dotSeparatedComponents,"' requires the name of a VAR to be passed."));break}var u=new Y(s.name);e.AddContent(u);}else i.GenerateIntoContainer(e);}a.isFunctionCall||e.AddContent(et.EvalEnd());}return a.isThread?e.AddContent(et.StartThread()):(a.isFunctionCall||a.isTunnel)&&(a.runtimeDivert.pushesToStack=!0,a.runtimeDivert.stackPushType=a.isFunctionCall?ct.Function:ct.Tunnel),e.AddContent(a.runtimeDivert),e}return a.runtimeDivert},a.PathAsVariableName=function(){return a.target?a.target.firstComponent:null},a.ResolveTargetContent=function(){if(!a.isEmpty&&!a.isEnd&&null===a.targetContent){var t=a.PathAsVariableName();if(null!==t){var e=_(xt(h(a)),Ot);if(e){var n=e.ResolveVariableWithName(t,h(a));if(n.found){if(n.isArgument&&n.ownerFlow&&n.ownerFlow.args){var r=n.ownerFlow.args.find((function(e){var n;return (null===(n=e.identifier)||void 0===n?void 0:n.name)==t}));r&&!r.isDivertTarget&&a.Error("Since '".concat(r.identifier,"' is used as a variable divert target (on ").concat(a.debugMetadata,"), it should be marked as: -> ").concat(r.identifier),n.ownerFlow);}return void(a.runtimeDivert.variableDivertName=t)}}}if(!a.target)throw new Error;a.targetContent=a.target.ResolveFromContext(h(a));}},a.CheckArgumentValidity=function(){if(!a.isEmpty){var t=0;if(null!==a.args&&a.args.length>0&&(t=a.args.length),null!==a.targetContent){var e=_(a.targetContent,Ot);if(0!==t||null!==e&&e.hasParameters)if(null===e&&t>0)a.Error("target needs to be a knot or stitch in order to pass arguments");else if(null!==e&&(null===e.args||!e.args&&t>0))a.Error("target (".concat(e.name,") doesn't take parameters"));else if(a.parent instanceof Vt)t>0&&a.Error("can't store arguments in a divert target variable");else {var n,r=e.args.length;if(r!==t)return n=0===t?"but there weren't any passed to it":t<r?"but only got ".concat(t):"but got ".concat(t),void a.Error("to '".concat(e.identifier,"' requires ").concat(r," arguments, ").concat(n));for(var i=0;i<r;++i){var o=e.args[i],s=a.args[i];if(o.isDivertTarget){var l=_(s,Ft);if(s instanceof Vt||null!==l){if(l){var u=new Tt(l.pathIdentifiers);u.ResolveFromContext(l)&&a.Error("Passing read count of '".concat(u.dotSeparatedComponents,"' instead of a divert target. You probably meant '").concat(u,"'"));}}else a.Error("Target '".concat(e.identifier,"' expects a divert target for the parameter named -> ").concat(o.identifier," but saw ").concat(s),s);}}null!==e||a.Error("Can't call as a function or with arguments unless it's a knot or stitch");}}}},a.CheckExternalArgumentValidity=function(t){var e=a.target?a.target.firstComponent:null,n=t.externals.get(e);if(!n)throw new Error("external not found");var r=n.argumentNames.length,i=0;a.args&&(i=a.args.length),i!==r&&a.Error("incorrect number of arguments sent to external function '".concat(e,"'. Expected ").concat(r," but got ").concat(i));},a.toString=function(){var t="";return null===a.target?"-> <empty divert>":(t+=a.target.toString(),a.isTunnel&&(t+=" ->"),a.isFunctionCall&&(t+=" ()"),t)},t&&(a.target=t),i&&(a.args=i,a.AddContent(i)),a}return i(r,[{key:"runtimeDivert",get:function(){if(!this._runtimeDivert)throw new Error;return this._runtimeDivert},set:function(t){this._runtimeDivert=t;}},{key:"isEnd",get:function(){return Boolean(this.target&&"END"===this.target.dotSeparatedComponents)}},{key:"isDone",get:function(){return Boolean(this.target&&"DONE"===this.target.dotSeparatedComponents)}},{key:"typeName",get:function(){return "Divert"}},{key:"ResolveReferences",value:function(t){if(!(this.isEmpty||this.isEnd||this.isDone)){if(!this.runtimeDivert)throw new Error;this.targetContent&&(this.runtimeDivert.targetPath=this.targetContent.runtimePath),p(o(r.prototype),"ResolveReferences",this).call(this,t);var e=_(this.targetContent,Ot);e&&(!e.isFunction&&this.isFunctionCall?p(o(r.prototype),"Error",this).call(this,"".concat(e.identifier," hasn't been marked as a function, but it's being called as one. Do you need to delcare the knot as '== function ").concat(e.identifier," =='?")):!e.isFunction||this.isFunctionCall||this.parent instanceof Vt||p(o(r.prototype),"Error",this).call(this,e.identifier+" can't be diverted to. It can only be called as a function since it's been marked as such: '"+e.identifier+"(...)'"));var n=null!==this.targetContent,i=!1,a=!1;if(!this.target)throw new Error;if(1===this.target.numberOfComponents){if(!this.target.firstComponent)throw new Error;if(i=Rt.IsBuiltIn(this.target.firstComponent),a=t.IsExternal(this.target.firstComponent),i||a)return this.isFunctionCall||p(o(r.prototype),"Error",this).call(this,"".concat(this.target.firstComponent," must be called as a function: ~ ").concat(this.target.firstComponent,"()")),void(a&&(this.runtimeDivert.isExternal=!0,null!==this.args&&(this.runtimeDivert.externalArgs=this.args.length),this.runtimeDivert.pushesToStack=!1,this.runtimeDivert.targetPath=new R(this.target.firstComponent),this.CheckExternalArgumentValidity(t)))}null==this.runtimeDivert.variableDivertName&&(n||i||a||this.Error("target not found: '".concat(this.target,"'")));}}},{key:"Error",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];e!==this&&e?p(o(r.prototype),"Error",this).call(this,t,e):this.isFunctionCall?p(o(r.prototype),"Error",this).call(this,"Function call ".concat(t),e,n):p(o(r.prototype),"Error",this).call(this,"Divert ".concat(t),e,n);}}]),r}(W),Mt=i((function t(e,r){n(this,t),this.divert=e,this.targetRuntimeObj=r;})),Bt=i((function t(e,r){n(this,t),this.divert=e,this.targetContent=r;}));!function(t){t[t.Stopping=1]="Stopping",t[t.Cycle=2]="Cycle",t[t.Shuffle=4]="Shuffle",t[t.Once=8]="Once";}(Dt||(Dt={}));var Gt,qt=function(t){a(r,t);var e=d(r);function r(t,i){var a;n(this,r),(a=e.call(this)).sequenceType=i,a._sequenceDivertsToResolve=[],a.GenerateRuntimeObject=function(){var t=new tt;t.visitsShouldBeCounted=!0,t.countingAtStartOnly=!0,a._sequenceDivertsToResolve=[],t.AddContent(et.EvalStart()),t.AddContent(et.VisitIndex());var e=(a.sequenceType&Dt.Once)>0,n=(a.sequenceType&Dt.Cycle)>0,r=(a.sequenceType&Dt.Stopping)>0,i=(a.sequenceType&Dt.Shuffle)>0,o=a.sequenceElements.length;if(e&&(o+=1),r||e?(t.AddContent(new J(o-1)),t.AddContent(it.CallWithName("MIN"))):n&&(t.AddContent(new J(a.sequenceElements.length)),t.AddContent(it.CallWithName("%"))),i){var s=et.NoOp();if(e||r){var l=r?a.sequenceElements.length-1:a.sequenceElements.length;t.AddContent(et.Duplicate()),t.AddContent(new J(l)),t.AddContent(it.CallWithName("=="));var u=new vt;u.isConditional=!0,t.AddContent(u),a.AddDivertToResolve(u,s);}var c=a.sequenceElements.length;r&&(c-=1),t.AddContent(new J(c)),t.AddContent(et.SequenceShuffleIndex()),(e||r)&&t.AddContent(s);}t.AddContent(et.EvalEnd());for(var h=et.NoOp(),f=0;f<o;f+=1){t.AddContent(et.EvalStart()),t.AddContent(et.Duplicate()),t.AddContent(new J(f)),t.AddContent(it.CallWithName("==")),t.AddContent(et.EvalEnd());var d=new vt;d.isConditional=!0,t.AddContent(d);var v=void 0;if(f<a.sequenceElements.length)v=a.sequenceElements[f].runtimeObject;else v=new tt;v.name="s".concat(f),v.InsertContent(et.PopEvaluatedValue(),0);var p=new vt;v.AddContent(p),t.AddToNamedContentOnly(v),a.AddDivertToResolve(d,v),a.AddDivertToResolve(p,h);}return t.AddContent(h),t},a.AddDivertToResolve=function(t,e){a._sequenceDivertsToResolve.push(new Bt(t,e));},a.sequenceType=i,a.sequenceElements=[];var o,s=S(t);try{for(s.s();!(o=s.n()).done;){var l=o.value,u=l.content,c=null;c=null===u||0===u.length?l:new zt(u),a.sequenceElements.push(c),a.AddContent(c);}}catch(t){s.e(t);}finally{s.f();}return a}return i(r,[{key:"typeName",get:function(){return "Sequence"}},{key:"ResolveReferences",value:function(t){p(o(r.prototype),"ResolveReferences",this).call(this,t);var e,n=S(this._sequenceDivertsToResolve);try{for(n.s();!(e=n.n()).done;){var i=e.value;i.divert.targetPath=i.targetContent.path;}}catch(t){n.e(t);}finally{n.f();}}}]),r}(W),Ut=function(t){a(r,t);var e=d(r);function r(){var t;return n(this,r),(t=e.apply(this,arguments))._overrideDivertTarget=null,t._divertAfter=null,t.GenerateRuntimeObject=function(){var e=new tt;if(e.AddContent(et.EvalStart()),t.divertAfter){var n=t.divertAfter.GenerateRuntimeObject();if(n){var r=t.divertAfter.args;if(null!==r&&r.length>0){for(var i=-1,a=-1,o=0;o<n.content.length;o+=1){var s=n.content[o];s&&(-1==i&&s.commandType===et.CommandType.EvalStart?i=o:s.commandType===et.CommandType.EvalEnd&&(a=o));}for(var l=i+1;l<a;l+=1){n.content[l].parent=null,e.AddContent(n.content[l]);}}}t._overrideDivertTarget=new X,e.AddContent(t._overrideDivertTarget);}else e.AddContent(new rt);return e.AddContent(et.EvalEnd()),e.AddContent(et.PopTunnel()),e},t.toString=function(){return " -> ".concat(t._divertAfter)},t}return i(r,[{key:"divertAfter",get:function(){return this._divertAfter},set:function(t){this._divertAfter=t,this._divertAfter&&this.AddContent(this._divertAfter);}},{key:"typeName",get:function(){return "TunnelOnwards"}},{key:"ResolveReferences",value:function(t){p(o(r.prototype),"ResolveReferences",this).call(this,t),this.divertAfter&&this.divertAfter.targetContent&&(this._overrideDivertTarget.targetPath=this.divertAfter.targetContent.runtimePath);}}]),r}(W),Kt=function(){function t(e,r){n(this,t),this._name=e||"",this._items=null,this._itemNameToValues=r||new Map;}return i(t,[{key:"name",get:function(){return this._name}},{key:"items",get:function(){if(null==this._items){this._items=new Map;var t,e=S(this._itemNameToValues);try{for(e.s();!(t=e.n()).done;){var n=m(t.value,2),r=n[0],i=n[1],a=new M(this.name,r);this._items.set(a.serialized(),i);}}catch(t){e.e(t);}finally{e.f();}}return this._items}},{key:"ValueForItem",value:function(t){if(!t.itemName)return 0;var e=this._itemNameToValues.get(t.itemName);return void 0!==e?e:0}},{key:"ContainsItem",value:function(t){return !!t.itemName&&(t.originName==this.name&&this._itemNameToValues.has(t.itemName))}},{key:"ContainsItemWithName",value:function(t){return this._itemNameToValues.has(t)}},{key:"TryGetItemWithValue",value:function(t,e){var n,r=S(this._itemNameToValues);try{for(r.s();!(n=r.n()).done;){var i=m(n.value,2),a=i[0];if(i[1]==t)return {result:new M(this.name,a),exists:!0}}}catch(t){r.e(t);}finally{r.f();}return {result:M.Null,exists:!1}}},{key:"TryGetValueForItem",value:function(t,e){if(!t.itemName)return {result:0,exists:!1};var n=this._itemNameToValues.get(t.itemName);return n?{result:n,exists:!0}:{result:0,exists:!1}}}]),t}(),Ht=function(t){a(r,t);var e=d(r);function r(t){var i;n(this,r),(i=e.call(this)).itemDefinitions=t,i.identifier=null,i.variableAssignment=null,i._elementsByName=null,i.ItemNamed=function(t){if(null===i._elementsByName){i._elementsByName=new Map;var e,n=S(i.itemDefinitions);try{for(n.s();!(e=n.n()).done;){var r=e.value;i._elementsByName.set(r.name,r);}}catch(t){n.e(t);}finally{n.f();}}return i._elementsByName.get(t)||null},i.GenerateRuntimeObject=function(){var t,e,n,r=new B,a=S(i.itemDefinitions);try{for(a.s();!(n=a.n()).done;){var o=n.value;if(o.inInitialList){var s=new M((null===(t=i.identifier)||void 0===t?void 0:t.name)||null,o.name||null);r.Add(s,o.seriesValue);}}}catch(t){a.e(t);}finally{a.f();}return r.SetInitialOriginName((null===(e=i.identifier)||void 0===e?void 0:e.name)||""),new Z(r)};var a,o=1,s=S(i.itemDefinitions);try{for(s.s();!(a=s.n()).done;){var l=a.value;null!==l.explicitValue&&(o=l.explicitValue),l.seriesValue=o,o+=1;}}catch(t){s.e(t);}finally{s.f();}return i.AddContent(t),i}return i(r,[{key:"typeName",get:function(){return "ListDefinition"}},{key:"runtimeListDefinition",get:function(){var t,e,n=new Map,r=S(this.itemDefinitions);try{for(r.s();!(e=r.n()).done;){var i=e.value;n.has(i.name)?this.Error("List '".concat(this.identifier,"' contains duplicate items called '").concat(i.name,"'")):n.set(i.name,i.seriesValue);}}catch(t){r.e(t);}finally{r.f();}return new Kt((null===(t=this.identifier)||void 0===t?void 0:t.name)||"",n)}},{key:"ResolveReferences",value:function(t){p(o(r.prototype),"ResolveReferences",this).call(this,t),t.CheckForNamingCollisions(this,this.identifier,ft.List);}}]),r}(W),Jt=function(t){a(r,t);var e=d(r);function r(t){var i,a=t.assignedExpression,o=t.isGlobalDeclaration,s=t.isTemporaryNewDeclaration,l=t.listDef,u=t.variableIdentifier;return n(this,r),(i=e.call(this))._runtimeAssignment=null,i.expression=null,i.listDefinition=null,i.GenerateRuntimeObject=function(){var t=null;if(i.isGlobalDeclaration?t=i.story:i.isNewTemporaryDeclaration&&(t=xt(h(i))),t&&t.AddNewVariableDeclaration(h(i)),i.isGlobalDeclaration)return null;var e=new tt;return i.expression?e.AddContent(i.expression.runtimeObject):i.listDefinition&&e.AddContent(i.listDefinition.runtimeObject),i._runtimeAssignment=new pt(i.variableName,i.isNewTemporaryDeclaration),e.AddContent(i._runtimeAssignment),e},i.toString=function(){return "".concat(i.isGlobalDeclaration?"VAR":i.isNewTemporaryDeclaration?"~ temp":""," ").concat(i.variableName)},i.variableIdentifier=u,i.isGlobalDeclaration=Boolean(o),i.isNewTemporaryDeclaration=Boolean(s),l instanceof Ht?(i.listDefinition=i.AddContent(l),i.listDefinition.variableAssignment=h(i),i.isGlobalDeclaration=!0):a&&(i.expression=i.AddContent(a)),i}return i(r,[{key:"variableName",get:function(){return this.variableIdentifier.name}},{key:"typeName",get:function(){return this.isNewTemporaryDeclaration?"temp":this.isGlobalDeclaration?null!==this.listDefinition?"LIST":"VAR":"variable assignment"}},{key:"isDeclaration",get:function(){return this.isGlobalDeclaration||this.isNewTemporaryDeclaration}},{key:"ResolveReferences",value:function(t){if(p(o(r.prototype),"ResolveReferences",this).call(this,t),this.isDeclaration&&null===this.listDefinition&&t.CheckForNamingCollisions(this,this.variableIdentifier,this.isGlobalDeclaration?ft.Var:ft.Temp),this.isGlobalDeclaration){var e=_(this.expression,Ft);!e||e.isConstantReference||e.isListItemReference||this.Error("global variable assignments cannot refer to other variables, only literal values, constants and list items");}if(!this.isNewTemporaryDeclaration){var n=t.ResolveVariableWithName(this.variableName,this);n.found||(this.variableName in this.story.constants?this.Error("Can't re-assign to a constant (do you need to use VAR when declaring '".concat(this.variableName,"'?)"),this):this.Error("Variable could not be found to assign to: '".concat(this.variableName,"'"),this)),this._runtimeAssignment&&(this._runtimeAssignment.isGlobal=n.isGlobal);}}}]),r}(W),zt=function(t){a(r,t);var e=d(r);function r(t){var i,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1;return n(this,r),(i=e.call(this)).previousWeavePoint=null,i.addContentToPreviousWeavePoint=!1,i.hasSeenChoiceInSection=!1,i.currentContainer=null,i._unnamedGatherCount=0,i._choiceCount=0,i._rootContainer=null,i._namedWeavePoints=new Map,i.looseEnds=[],i.gatherPointsToResolve=[],i.ResolveWeavePointNaming=function(){var t,e,n,r=[].concat(y(i.FindAll(At)((function(t){return !(null===t.name||void 0===t.name)}))),y(i.FindAll(mt)((function(t){return !(null===t.name||void 0===t.name)}))));i._namedWeavePoints=new Map;var a,o=S(r);try{for(o.s();!(a=o.n()).done;){var s=a.value,l=i.namedWeavePoints.get((null===(t=s.identifier)||void 0===t?void 0:t.name)||"");if(l){var u=l instanceof At?"gather":"choice",c=l;i.Error("A ".concat(u," with the same label name '").concat(s.name,"' already exists in this context on line ").concat(c.debugMetadata?c.debugMetadata.startLineNumber:"NO DEBUG METADATA AVAILABLE"),s);}(null===(e=s.identifier)||void 0===e?void 0:e.name)&&i.namedWeavePoints.set(null===(n=s.identifier)||void 0===n?void 0:n.name,s);}}catch(t){o.e(t);}finally{o.f();}},i.ConstructWeaveHierarchyFromIndentation=function(){for(var t=0;t<i.content.length;){var e=i.content[t];if(e instanceof mt||e instanceof At){var n=e.indentationDepth-1;if(n>i.baseIndentIndex){for(var a=t;t<i.content.length;){var o=_(i.content[t],mt)||_(i.content[t],At);if(null!==o)if(o.indentationDepth-1<=i.baseIndentIndex)break;t+=1;}var s=t-a,l=i.content.slice(a,a+s);i.content.splice(a,s);var u=new r(l,n);i.InsertContent(a,u),t=a;}}t+=1;}},i.DetermineBaseIndentationFromContent=function(t){var e,n=S(t);try{for(n.s();!(e=n.n()).done;){var r=e.value;if(r instanceof mt||r instanceof At)return r.indentationDepth-1}}catch(t){n.e(t);}finally{n.f();}return 0},i.GenerateRuntimeObject=function(){i._rootContainer=new tt,i.currentContainer=i._rootContainer,i.looseEnds=[],i.gatherPointsToResolve=[];var t,e=S(i.content);try{for(e.s();!(t=e.n()).done;){var n=t.value;if(n instanceof mt||n instanceof At)i.AddRuntimeForWeavePoint(n);else if(n instanceof r){var a,o=n;i.AddRuntimeForNestedWeave(o),(a=i.gatherPointsToResolve).splice.apply(a,[0,0].concat(y(o.gatherPointsToResolve)));}else i.AddGeneralRuntimeContent(n.runtimeObject);}}catch(t){e.e(t);}finally{e.f();}return i.PassLooseEndsToAncestors(),i._rootContainer},i.AddRuntimeForGather=function(t){var e=!i.hasSeenChoiceInSection;i.hasSeenChoiceInSection=!1;var n=t.runtimeContainer;if(t.name||(n.name="g-".concat(i._unnamedGatherCount),i._unnamedGatherCount+=1),e){if(!i.currentContainer)throw new Error;i.currentContainer.AddContent(n);}else i.rootContainer.AddToNamedContentOnly(n);var r,a=S(i.looseEnds);try{for(a.s();!(r=a.n()).done;){var o=r.value;if(o instanceof At)if(o.indentationDepth==t.indentationDepth)continue;var s=null;if(o instanceof jt)s=o.runtimeObject;else {s=new vt;var l=o;if(!l.runtimeContainer)throw new Error;l.runtimeContainer.AddContent(s);}i.gatherPointsToResolve.push(new Mt(s,n));}}catch(t){a.e(t);}finally{a.f();}i.looseEnds=[],i.currentContainer=n;},i.AddRuntimeForWeavePoint=function(t){if(t instanceof At)i.AddRuntimeForGather(t);else if(t instanceof mt){if(!i.currentContainer)throw new Error;i.previousWeavePoint instanceof At&&i.looseEnds.splice(i.looseEnds.indexOf(i.previousWeavePoint),1);var e=t;if(i.currentContainer.AddContent(e.runtimeObject),!e.innerContentContainer)throw new Error;e.innerContentContainer.name="c-".concat(i._choiceCount),i.currentContainer.AddToNamedContentOnly(e.innerContentContainer),i._choiceCount+=1,i.hasSeenChoiceInSection=!0;}(i.addContentToPreviousWeavePoint=!1,i.WeavePointHasLooseEnd(t))&&(i.looseEnds.push(t),_(t,mt)&&(i.addContentToPreviousWeavePoint=!0));i.previousWeavePoint=t;},i.AddRuntimeForNestedWeave=function(t){i.AddGeneralRuntimeContent(t.rootContainer),null!==i.previousWeavePoint&&(i.looseEnds.splice(i.looseEnds.indexOf(i.previousWeavePoint),1),i.addContentToPreviousWeavePoint=!1);},i.AddGeneralRuntimeContent=function(t){if(null!==t)if(i.addContentToPreviousWeavePoint){if(!i.previousWeavePoint||!i.previousWeavePoint.runtimeContainer)throw new Error;i.previousWeavePoint.runtimeContainer.AddContent(t);}else {if(!i.currentContainer)throw new Error;i.currentContainer.AddContent(t);}},i.PassLooseEndsToAncestors=function(){if(0!==i.looseEnds.length){for(var t=null,e=null,n=!1,a=i.parent;null!==a;a=a.parent){var o=_(a,r);o&&(n||null!==t||(t=o),n&&null===e&&(e=o)),(a instanceof qt||a instanceof kt)&&(n=!0);}if(null!==t||null!==e)for(var s=i.looseEnds.length-1;s>=0;s-=1){var l=i.looseEnds[s],u=!1;if(n){if(l instanceof mt&&null!==t)t.ReceiveLooseEnd(l),u=!0;else if(!(l instanceof mt)){var c=t||e;null!==c&&(c.ReceiveLooseEnd(l),u=!0);}}else (null==t?void 0:t.hasOwnProperty("ReceiveLooseEnd"))&&t.ReceiveLooseEnd(l),u=!0;u&&i.looseEnds.splice(s,1);}}},i.ReceiveLooseEnd=function(t){i.looseEnds.push(t);},i.WeavePointNamed=function(t){if(!i.namedWeavePoints)return null;var e=i.namedWeavePoints.get(t);return e||null},i.IsGlobalDeclaration=function(t){var e=_(t,Jt);return !!(e&&e.isGlobalDeclaration&&e.isDeclaration)||!!_(t,_t)},i.ContentThatFollowsWeavePoint=function(t){var e=[],n=t;if(null!==n.content){var a,o=S(n.content);try{for(o.s();!(a=o.n()).done;){var s=a.value;i.IsGlobalDeclaration(s)||e.push(s);}}catch(t){o.e(t);}finally{o.f();}}var l=_(n.parent,r);if(null===l)throw new Error("Expected weave point parent to be weave?");for(var u=l.content.indexOf(n)+1;u<l.content.length;u+=1){var c=l.content[u];if(!i.IsGlobalDeclaration(c)){if(c instanceof mt||c instanceof At)break;if(c instanceof r)break;e.push(c);}}return e},i.ValidateTermination=function(t){if(!(i.lastParsedSignificantObject instanceof F))if(null!==i.looseEnds&&i.looseEnds.length>0){var e,n=S(i.looseEnds);try{for(n.s();!(e=n.n()).done;){var r=e.value,a=i.ContentThatFollowsWeavePoint(r);i.ValidateFlowOfObjectsTerminates(a,r,t);}}catch(t){n.e(t);}finally{n.f();}}else {var o,s=S(i.content);try{for(s.s();!(o=s.n()).done;){var l=o.value;if(l instanceof mt||l instanceof jt)return}}catch(t){s.e(t);}finally{s.f();}i.ValidateFlowOfObjectsTerminates(i.content,h(i),t);}},i.BadNestedTerminationHandler=function(t){for(var e=null,n=t.parent;null!==n;n=n.parent)if(n instanceof qt||n instanceof kt){e=_(n,kt);break}var r="Choices nested in conditionals or sequences need to explicitly divert afterwards.";null!==e&&(1===e.FindAll(mt)().length&&(r="Choices with conditions should be written: '* {condition} choice'. Otherwise, ".concat(r.toLowerCase())));i.Error(r,t);},i.ValidateFlowOfObjectsTerminates=function(t,e,n){var r,i=!1,a=e,o=S(t);try{for(o.s();!(r=o.n()).done;){var s=r.value;if(null!==s.Find(jt)((function(t){return !(t.isThread||t.isTunnel||t.isFunctionCall||t.parent instanceof Vt)}))&&(i=!0),null!=s.Find(Ut)()){i=!0;break}a=s;}}catch(t){o.e(t);}finally{o.f();}if(!i){if(a instanceof F)return;n(a);}},i.WeavePointHasLooseEnd=function(t){if(null===t.content)return !0;for(var e=t.content.length-1;e>=0;--e){var n=_(t.content[e],jt);if(n)if(!(n.isThread||n.isTunnel||n.isFunctionCall))return !1}return !0},i.CheckForWeavePointNamingCollisions=function(){if(i.namedWeavePoints){var t,e=[],n=S(i.ancestry);try{for(n.s();!(t=n.n()).done;){var r=_(t.value,Ot);if(!r)break;e.push(r);}}catch(t){n.e(t);}finally{n.f();}var a,o=S(i.namedWeavePoints);try{for(o.s();!(a=o.n()).done;){var s,l=m(a.value,2),u=l[0],c=l[1],h=S(e);try{for(h.s();!(s=h.n()).done;){var f=s.value.ContentWithNameAtLevel(u);if(f&&f!==c){var d="".concat(c.GetType()," '").concat(u,"' has the same label name as a ").concat(f.GetType()," (on ").concat(f.debugMetadata,")");i.Error(d,c);}}}catch(t){h.e(t);}finally{h.f();}}}catch(t){o.e(t);}finally{o.f();}}},i.baseIndentIndex=-1==a?i.DetermineBaseIndentationFromContent(t):a,i.AddContent(t),i.ConstructWeaveHierarchyFromIndentation(),i}return i(r,[{key:"rootContainer",get:function(){return this._rootContainer||(this._rootContainer=this.GenerateRuntimeObject()),this._rootContainer}},{key:"namedWeavePoints",get:function(){return this._namedWeavePoints}},{key:"lastParsedSignificantObject",get:function(){if(0===this.content.length)return null;for(var t=null,e=this.content.length-1;e>=0;--e){var n=_(t=this.content[e],Et);if((!n||"\n"!==n.text)&&!this.IsGlobalDeclaration(t))break}var i=_(t,r);return i&&(t=i.lastParsedSignificantObject),t}},{key:"typeName",get:function(){return "Weave"}},{key:"ResolveReferences",value:function(t){if(p(o(r.prototype),"ResolveReferences",this).call(this,t),null!==this.looseEnds&&this.looseEnds.length>0){for(var e=!1,n=this.parent;null!==n;n=n.parent)if(n instanceof qt||n instanceof kt){e=!0;break}e&&this.ValidateTermination(this.BadNestedTerminationHandler);}var i,a=S(this.gatherPointsToResolve);try{for(a.s();!(i=a.n()).done;){var s=i.value;s.divert.targetPath=s.targetRuntimeObj.path;}}catch(t){a.e(t);}finally{a.f();}this.CheckForWeavePointNamingCollisions();}}]),r}(W),$t=function(t){a(r,t);var e=d(r);function r(t){var i;return n(this,r),(i=e.call(this))._contentContainer=null,i._conditionalDivert=null,i._ownExpression=null,i._innerWeave=null,i.isTrueBranch=!1,i.matchingEquality=!1,i.isElse=!1,i.isInline=!1,i.returnDivert=null,i.GenerateRuntimeObject=function(){if(i._innerWeave){var t,e=S(i._innerWeave.content);try{for(e.s();!(t=e.n()).done;){var n=_(t.value,Et);n&&n.text.startsWith("else:")&&i.Warning("Saw the text 'else:' which is being treated as content. Did you mean '- else:'?",n);}}catch(t){e.e(t);}finally{e.f();}}var r=new tt,a=i.matchingEquality&&!i.isElse;if(a&&r.AddContent(et.Duplicate()),i._conditionalDivert=new vt,i._conditionalDivert.isConditional=!i.isElse,!i.isTrueBranch&&!i.isElse){var o=null!==i.ownExpression;o&&r.AddContent(et.EvalStart()),i.ownExpression&&i.ownExpression.GenerateIntoContainer(r),i.matchingEquality&&r.AddContent(it.CallWithName("==")),o&&r.AddContent(et.EvalEnd());}return r.AddContent(i._conditionalDivert),i._contentContainer=i.GenerateRuntimeForContent(),i._contentContainer.name="b",i.isInline||i._contentContainer.InsertContent(new $("\n"),0),(a||i.isElse&&i.matchingEquality)&&i._contentContainer.InsertContent(et.PopEvaluatedValue(),0),r.AddToNamedContentOnly(i._contentContainer),i.returnDivert=new vt,i._contentContainer.AddContent(i.returnDivert),r},i.GenerateRuntimeForContent=function(){return null===i._innerWeave?new tt:i._innerWeave.rootContainer},t&&(i._innerWeave=new zt(t),i.AddContent(i._innerWeave)),i}return i(r,[{key:"ownExpression",get:function(){return this._ownExpression},set:function(t){this._ownExpression=t,this._ownExpression&&this.AddContent(this._ownExpression);}},{key:"typeName",get:function(){return "ConditionalSingleBranch"}},{key:"ResolveReferences",value:function(t){if(!this._conditionalDivert||!this._contentContainer)throw new Error;this._conditionalDivert.targetPath=this._contentContainer.path,p(o(r.prototype),"ResolveReferences",this).call(this,t);}}]),r}(W);!function(t){t[t.ParsingString=1]="ParsingString";}(Gt||(Gt={}));var Xt,Yt=function(){function t(){n(this,t),this.startLineNumber=0,this.endLineNumber=0,this.startCharacterNumber=0,this.endCharacterNumber=0,this.fileName=null,this.sourceName=null;}return i(t,[{key:"Merge",value:function(e){var n=new t;return n.fileName=this.fileName,n.sourceName=this.sourceName,this.startLineNumber<e.startLineNumber?(n.startLineNumber=this.startLineNumber,n.startCharacterNumber=this.startCharacterNumber):this.startLineNumber>e.startLineNumber?(n.startLineNumber=e.startLineNumber,n.startCharacterNumber=e.startCharacterNumber):(n.startLineNumber=this.startLineNumber,n.startCharacterNumber=Math.min(this.startCharacterNumber,e.startCharacterNumber)),this.endLineNumber>e.endLineNumber?(n.endLineNumber=this.endLineNumber,n.endCharacterNumber=this.endCharacterNumber):this.endLineNumber<e.endLineNumber?(n.endLineNumber=e.endLineNumber,n.endCharacterNumber=e.endCharacterNumber):(n.endLineNumber=this.endLineNumber,n.endCharacterNumber=Math.max(this.endCharacterNumber,e.endCharacterNumber)),n}},{key:"toString",value:function(){return null!==this.fileName?"line ".concat(this.startLineNumber," of ").concat(this.fileName,'"'):"line "+this.startLineNumber}}]),t}(),Zt=function(t){a(r,t);var e=d(r);function r(t,i){var a;return n(this,r),(a=e.call(this)).identifier=t,a.argumentNames=i,a.GenerateRuntimeObject=function(){return a.story.AddExternal(h(a)),null},a}return i(r,[{key:"name",get:function(){var t;return (null===(t=this.identifier)||void 0===t?void 0:t.name)||null}},{key:"typeName",get:function(){return "EXTERNAL"}},{key:"toString",value:function(){var t;return "EXTERNAL ".concat(null===(t=this.identifier)||void 0===t?void 0:t.name)}}]),r}(W),Qt=i((function t(e,r,i){n(this,t),this.name=e,this.args=r,this.isFunction=i;})),te=function(t){a(r,t);var e=d(r);function r(t){var i;return n(this,r),(i=e.call(this))._objToWrap=t,i.GenerateRuntimeObject=function(){return i._objToWrap},i}return i(r)}(W),ee=function(t){a(r,t);var e=d(r);function r(t){return n(this,r),e.call(this,t)}return i(r,[{key:"typeName",get:function(){return "Glue"}}]),r}(te),ne=function(t){a(r,t);var e=d(r);function r(){return n(this,r),e.apply(this,arguments)}return i(r,[{key:"toString",value:function(){return "Glue"}}]),r}(V),re=function(t){a(r,t);var e=d(r);function r(t,i,a){var o;return n(this,r),(o=e.call(this)).varIdentifier=t,o._runtimeAssignment=null,o.expression=null,o.GenerateIntoContainer=function(t){var e,n;t.AddContent(new Wt((null===(e=o.varIdentifier)||void 0===e?void 0:e.name)||null)),o.expression?o.expression.GenerateIntoContainer(t):t.AddContent(new J(1)),t.AddContent(it.CallWithName(o.isInc?"+":"-")),o._runtimeAssignment=new pt((null===(n=o.varIdentifier)||void 0===n?void 0:n.name)||null,!1),t.AddContent(o._runtimeAssignment);},o.toString=function(){var t,e;return o.expression?"".concat(null===(t=o.varIdentifier)||void 0===t?void 0:t.name).concat(o.isInc?" += ":" -= ").concat(o.expression):"".concat(null===(e=o.varIdentifier)||void 0===e?void 0:e.name)+(o.isInc?"++":"--")},i instanceof nt?(o.expression=i,o.AddContent(o.expression),o.isInc=Boolean(a)):o.isInc=i,o}return i(r,[{key:"typeName",get:function(){return "IncDecExpression"}},{key:"ResolveReferences",value:function(t){var e;p(o(r.prototype),"ResolveReferences",this).call(this,t);var n=t.ResolveVariableWithName((null===(e=this.varIdentifier)||void 0===e?void 0:e.name)||"",this);if(n.found||this.Error("variable for ".concat(this.incrementDecrementWord," could not be found: '").concat(this.varIdentifier,"' after searching: {this.descriptionOfScope}")),!this._runtimeAssignment)throw new Error;this._runtimeAssignment.isGlobal=n.isGlobal,this.parent instanceof zt||this.parent instanceof Ot||this.parent instanceof It||this.Error("Can't use ".concat(this.incrementDecrementWord," as sub-expression"));}},{key:"incrementDecrementWord",get:function(){return this.isInc?"increment":"decrement"}}]),r}(nt),ie=function(t){a(r,t);var e=d(r);function r(t){var i;return n(this,r),(i=e.call(this)).includedStory=t,i.GenerateRuntimeObject=function(){return null},i}return i(r)}(W),ae=i((function t(e,r,i){var a=this;n(this,t),this.type=e,this.precedence=r,this.requireWhitespace=i,this.toString=function(){return a.type};})),oe=function(t){a(r,t);var e=d(r);function r(t,i,a,o){return n(this,r),e.call(this,t,i,a,o)}return i(r,[{key:"flowLevel",get:function(){return bt.Knot}},{key:"typeName",get:function(){return this.isFunction?"Function":"Knot"}},{key:"ResolveReferences",value:function(t){p(o(r.prototype),"ResolveReferences",this).call(this,t);var e=this.story;for(var n in this.subFlowsByName){var i=e.ContentWithNameAtLevel(n,bt.Knot,!1);if(i){var a=this.subFlowsByName.get(n),s="Stitch '".concat(a?a.name:"NO STITCH FOUND","' has the same name as a knot (on ").concat(i.debugMetadata,")");this.Error(s,a);}}}}]),r}(Ot),se=function(t){a(r,t);var e=d(r);function r(t){var i;return n(this,r),(i=e.call(this)).itemIdentifierList=t,i.GenerateIntoContainer=function(t){var e,n,r=new B;if(null!=i.itemIdentifierList){var a,o=S(i.itemIdentifierList);try{for(o.s();!(a=o.n()).done;){var s=a.value,l=(null===(e=null==s?void 0:s.name)||void 0===e?void 0:e.split("."))||[],u=null,c="";l.length>1?(u=l[0],c=l[1]):c=l[0];var f=i.story.ResolveListItem(u,c,h(i));if(null===f)null===u?i.Error("Could not find list definition that contains item '".concat(s,"'")):i.Error("Could not find list item ".concat(s));else {if(null==f.parent)return void i.Error("Could not find list definition for item ".concat(s));u||(u=(null===(n=f.parent.identifier)||void 0===n?void 0:n.name)||null);var d=new M(u,f.name||null);r.has(d.serialized())?i.Warning("Duplicate of item '".concat(s,"' in list.")):r.Add(d,f.seriesValue);}}}catch(t){o.e(t);}finally{o.f();}}t.AddContent(new Z(r));},i}return i(r,[{key:"typeName",get:function(){return "List"}}]),r}(nt),le=function(t){a(r,t);var e=d(r);function r(t,i){var a,s,l=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;return n(this,r),(s=e.call(this)).indentifier=t,s.inInitialList=i,s.explicitValue=l,s.seriesValue=0,s.parent=null,s.GenerateRuntimeObject=function(){throw new Error("Not implemented.")},s.toString=function(){return s.fullName},s.parent=p((a=h(s),o(r.prototype)),"parent",a),s}return i(r,[{key:"fullName",get:function(){var t,e=this.parent;if(null===e)throw new Error("Can't get full name without a parent list.");return "".concat(null===(t=e.identifier)||void 0===t?void 0:t.name,".").concat(this.name)}},{key:"typeName",get:function(){return "ListElement"}},{key:"name",get:function(){var t;return (null===(t=this.indentifier)||void 0===t?void 0:t.name)||null}},{key:"ResolveReferences",value:function(t){p(o(r.prototype),"ResolveReferences",this).call(this,t),t.CheckForNamingCollisions(this,this.indentifier,ft.ListItem);}}]),r}(W);!function(t){t[t.InnerBlock=0]="InnerBlock",t[t.Stitch=1]="Stitch",t[t.Knot=2]="Knot",t[t.Top=3]="Top";}(Xt||(Xt={}));var ue=function(t){a(r,t);var e=d(r);function r(t,i,a,s){var l,u;return n(this,r),(u=e.call(this,t,i,a,s)).toString=function(){return "".concat(null!==u.parent?u.parent+" > ":"").concat(p((l=h(u),o(r.prototype)),"toString",l).call(l))},u}return i(r,[{key:"flowLevel",get:function(){return bt.Stitch}},{key:"typeName",get:function(){return "Stitch"}}]),r}(Ot),ce=function(t){a(r,t);var e=d(r);function r(t){var i;return n(this,r),(i=e.call(this)).text=t.toString()||"",i}return i(r,[{key:"toString",value:function(){return "# "+this.text}}]),r}(V),he=function(t){a(r,t);var e=d(r);function r(){var t;return n(this,r),(t=e.apply(this,arguments)).text="",t.index=0,t.threadAtGeneration=null,t.sourcePath="",t.targetPath=null,t.isInvisibleDefault=!1,t.originalThreadIndex=0,t}return i(r,[{key:"pathStringOnChoice",get:function(){return null===this.targetPath?L("Choice.targetPath"):this.targetPath.toString()},set:function(t){this.targetPath=new R(t);}}]),r}(V),fe=function(){function t(e){n(this,t),this._lists=new Map,this._allUnambiguousListValueCache=new Map;var r,i=S(e);try{for(i.s();!(r=i.n()).done;){var a=r.value;this._lists.set(a.name,a);var o,s=S(a.items);try{for(s.s();!(o=s.n()).done;){var l=m(o.value,2),u=l[0],c=l[1],h=M.fromSerializedKey(u),f=new Z(h,c);if(!h.itemName)throw new Error("item.itemName is null or undefined.");this._allUnambiguousListValueCache.set(h.itemName,f),this._allUnambiguousListValueCache.set(h.fullName,f);}}catch(t){s.e(t);}finally{s.f();}}}catch(t){i.e(t);}finally{i.f();}}return i(t,[{key:"lists",get:function(){var t,e=[],n=S(this._lists);try{for(n.s();!(t=n.n()).done;){var r=m(t.value,2)[1];e.push(r);}}catch(t){n.e(t);}finally{n.f();}return e}},{key:"TryListGetDefinition",value:function(t,e){if(null===t)return {result:e,exists:!1};var n=this._lists.get(t);return n?{result:n,exists:!0}:{result:e,exists:!1}}},{key:"FindSingleItemListWithName",value:function(t){if(null===t)return L("name");var e=this._allUnambiguousListValueCache.get(t);return void 0!==e?e:null}}]),t}(),de=function(){function t(){n(this,t);}return i(t,null,[{key:"JArrayToRuntimeObjList",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=t.length;e&&n--;for(var r=[],i=0;i<n;i++){var a=t[i],o=this.JTokenToRuntimeObject(a);if(null===o)return L("runtimeObj");r.push(o);}return r}},{key:"WriteDictionaryRuntimeObjs",value:function(t,e){t.WriteObjectStart();var n,r=S(e);try{for(r.s();!(n=r.n()).done;){var i=m(n.value,2),a=i[0],o=i[1];t.WritePropertyStart(a),this.WriteRuntimeObject(t,o),t.WritePropertyEnd();}}catch(t){r.e(t);}finally{r.f();}t.WriteObjectEnd();}},{key:"WriteListRuntimeObjs",value:function(t,e){t.WriteArrayStart();var n,r=S(e);try{for(r.s();!(n=r.n()).done;){var i=n.value;this.WriteRuntimeObject(t,i);}}catch(t){r.e(t);}finally{r.f();}t.WriteArrayEnd();}},{key:"WriteIntDictionary",value:function(t,e){t.WriteObjectStart();var n,r=S(e);try{for(r.s();!(n=r.n()).done;){var i=m(n.value,2),a=i[0],o=i[1];t.WriteIntProperty(a,o);}}catch(t){r.e(t);}finally{r.f();}t.WriteObjectEnd();}},{key:"WriteRuntimeObject",value:function(e,n){var r=_(n,tt);if(r)this.WriteRuntimeContainer(e,r);else {var i=_(n,vt);if(i){var a,o="->";return i.isExternal?o="x()":i.pushesToStack&&(i.stackPushType==ct.Function?o="f()":i.stackPushType==ct.Tunnel&&(o="->t->")),a=i.hasVariableTarget?i.variableDivertName:i.targetPathString,e.WriteObjectStart(),e.WriteProperty(o,a),i.hasVariableTarget&&e.WriteProperty("var",!0),i.isConditional&&e.WriteProperty("c",!0),i.externalArgs>0&&e.WriteIntProperty("exArgs",i.externalArgs),void e.WriteObjectEnd()}var s=_(n,ht);if(s)return e.WriteObjectStart(),e.WriteProperty("*",s.pathStringOnChoice),e.WriteIntProperty("flg",s.flags),void e.WriteObjectEnd();var l=_(n,H);if(l)e.WriteBool(l.value);else {var u=_(n,J);if(u)e.WriteInt(u.value);else {var c=_(n,z);if(c)e.WriteFloat(c.value);else {var h=_(n,$);if(h)h.isNewline?e.Write("\n",!1):(e.WriteStringStart(),e.WriteStringInner("^"),e.WriteStringInner(h.value),e.WriteStringEnd());else {var f=_(n,Z);if(f)this.WriteInkList(e,f);else {var d=_(n,X);if(d)return e.WriteObjectStart(),null===d.value?L("divTargetVal.value"):(e.WriteProperty("^->",d.value.componentsString),void e.WriteObjectEnd());var v=_(n,Y);if(v)return e.WriteObjectStart(),e.WriteProperty("^var",v.value),e.WriteIntProperty("ci",v.contextIndex),void e.WriteObjectEnd();if(_(n,ne))e.Write("<>");else {var p=_(n,et);if(p)e.Write(t._controlCommandNames[p.commandType]);else {var m=_(n,it);if(m){var y=m.name;return "^"==y&&(y="L^"),void e.Write(y)}var g=_(n,Wt);if(g){e.WriteObjectStart();var C=g.pathStringForCount;return null!=C?e.WriteProperty("CNT?",C):e.WriteProperty("VAR?",g.name),void e.WriteObjectEnd()}var S=_(n,pt);if(S){e.WriteObjectStart();var b=S.isGlobal?"VAR=":"temp=";return e.WriteProperty(b,S.variableName),S.isNewDeclaration||e.WriteProperty("re",!0),void e.WriteObjectEnd()}if(_(n,rt))e.Write("void");else {var w=_(n,ce);if(w)return e.WriteObjectStart(),e.WriteProperty("#",w.text),void e.WriteObjectEnd();var k=_(n,he);if(!k)throw new Error("Failed to convert runtime object to Json token: "+n);this.WriteChoice(e,k);}}}}}}}}}}},{key:"JObjectToDictionaryRuntimeObjs",value:function(t){var e=new Map;for(var n in t)if(t.hasOwnProperty(n)){var r=this.JTokenToRuntimeObject(t[n]);if(null===r)return L("inkObject");e.set(n,r);}return e}},{key:"JObjectToIntDictionary",value:function(t){var e=new Map;for(var n in t)t.hasOwnProperty(n)&&e.set(n,parseInt(t[n]));return e}},{key:"JTokenToRuntimeObject",value:function(n){if("number"==typeof n&&!isNaN(n)||"boolean"==typeof n)return K.Create(n);if("string"==typeof n){var r=n.toString(),i=r[0];if("^"==i)return new $(r.substring(1));if("\n"==i&&1==r.length)return new $("\n");if("<>"==r)return new ne;for(var a=0;a<t._controlCommandNames.length;++a){if(r==t._controlCommandNames[a])return new et(a)}if("L^"==r&&(r="^"),it.CallExistsWithName(r))return it.CallWithName(r);if("->->"==r)return et.PopTunnel();if("~ret"==r)return et.PopFunction();if("void"==r)return new rt}if("object"===e(n)&&!Array.isArray(n)){var o,s=n;if(s["^->"])return o=s["^->"],new X(new R(o.toString()));if(s["^var"]){o=s["^var"];var l=new Y(o.toString());return "ci"in s&&(o=s.ci,l.contextIndex=parseInt(o)),l}var u=!1,c=!1,h=ct.Function,f=!1;if((o=s["->"])?u=!0:(o=s["f()"])?(u=!0,c=!0,h=ct.Function):(o=s["->t->"])?(u=!0,c=!0,h=ct.Tunnel):(o=s["x()"])&&(u=!0,f=!0,c=!1,h=ct.Function),u){var d=new vt;d.pushesToStack=c,d.stackPushType=h,d.isExternal=f;var v=o.toString();return (o=s.var)?d.variableDivertName=v:d.targetPathString=v,d.isConditional=!!s.c,f&&(o=s.exArgs)&&(d.externalArgs=parseInt(o)),d}if(o=s["*"]){var p=new ht;return p.pathStringOnChoice=o.toString(),(o=s.flg)&&(p.flags=parseInt(o)),p}if(o=s["VAR?"])return new Wt(o.toString());if(o=s["CNT?"]){var m=new Wt;return m.pathStringForCount=o.toString(),m}var y=!1,g=!1;if((o=s["VAR="])?(y=!0,g=!0):(o=s["temp="])&&(y=!0,g=!1),y){var C=o.toString(),S=!s.re,b=new pt(C,S);return b.isGlobal=g,b}if(void 0!==s["#"])return o=s["#"],new ce(o.toString());if(o=s.list){var w=o,k=new B;if(o=s.origins){var E=o;k.SetInitialOriginNames(E);}for(var _ in w)if(w.hasOwnProperty(_)){var A=w[_],T=new M(_),P=parseInt(A);k.Add(T,P);}return new Z(k)}if(null!=s.originalChoicePath)return this.JObjectToChoice(s)}if(Array.isArray(n))return this.JArrayToContainer(n);if(null==n)return null;throw new Error("Failed to convert token to runtime object: "+this.toJson(n,["parent"]))}},{key:"toJson",value:function(t,e,n){return JSON.stringify(t,(function(t,n){return (null==e?void 0:e.some((function(e){return e===t})))?void 0:n}),n)}},{key:"WriteRuntimeContainer",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(t.WriteArrayStart(),null===e)return L("container");var r,i=S(e.content);try{for(i.s();!(r=i.n()).done;){var a=r.value;this.WriteRuntimeObject(t,a);}}catch(t){i.e(t);}finally{i.f();}var o=e.namedOnlyContent,s=e.countFlags,l=null!=e.name&&!n,u=null!=o||s>0||l;if(u&&t.WriteObjectStart(),null!=o){var c,h=S(o);try{for(h.s();!(c=h.n()).done;){var f=m(c.value,2),d=f[0],v=f[1],p=d,y=_(v,tt);t.WritePropertyStart(p),this.WriteRuntimeContainer(t,y,!0),t.WritePropertyEnd();}}catch(t){h.e(t);}finally{h.f();}}s>0&&t.WriteIntProperty("#f",s),l&&t.WriteProperty("#n",e.name),u?t.WriteObjectEnd():t.WriteNull(),t.WriteArrayEnd();}},{key:"JArrayToContainer",value:function(t){var e=new tt;e.content=this.JArrayToRuntimeObjList(t,!0);var n=t[t.length-1];if(null!=n){var r=new Map;for(var i in n)if("#f"==i)e.countFlags=parseInt(n[i]);else if("#n"==i)e.name=n[i].toString();else {var a=this.JTokenToRuntimeObject(n[i]),o=_(a,tt);o&&(o.name=i),r.set(i,a);}e.namedOnlyContent=r;}return e}},{key:"JObjectToChoice",value:function(t){var e=new he;return e.text=t.text.toString(),e.index=parseInt(t.index),e.sourcePath=t.originalChoicePath.toString(),e.originalThreadIndex=parseInt(t.originalThreadIndex),e.pathStringOnChoice=t.targetPath.toString(),e}},{key:"WriteChoice",value:function(t,e){t.WriteObjectStart(),t.WriteProperty("text",e.text),t.WriteIntProperty("index",e.index),t.WriteProperty("originalChoicePath",e.sourcePath),t.WriteIntProperty("originalThreadIndex",e.originalThreadIndex),t.WriteProperty("targetPath",e.pathStringOnChoice),t.WriteObjectEnd();}},{key:"WriteInkList",value:function(t,e){var n=e.value;if(null===n)return L("rawList");t.WriteObjectStart(),t.WritePropertyStart("list"),t.WriteObjectStart();var r,i=S(n);try{for(i.s();!(r=i.n()).done;){var a=m(r.value,2),o=a[0],s=a[1],l=M.fromSerializedKey(o),u=s;if(null===l.itemName)return L("item.itemName");t.WritePropertyNameStart(),t.WritePropertyNameInner(l.originName?l.originName:"?"),t.WritePropertyNameInner("."),t.WritePropertyNameInner(l.itemName),t.WritePropertyNameEnd(),t.Write(u),t.WritePropertyEnd();}}catch(t){i.e(t);}finally{i.f();}if(t.WriteObjectEnd(),t.WritePropertyEnd(),0==n.Count&&null!=n.originNames&&n.originNames.length>0){t.WritePropertyStart("origins"),t.WriteArrayStart();var c,h=S(n.originNames);try{for(h.s();!(c=h.n()).done;){var f=c.value;t.Write(f);}}catch(t){h.e(t);}finally{h.f();}t.WriteArrayEnd(),t.WritePropertyEnd();}t.WriteObjectEnd();}},{key:"ListDefinitionsToJToken",value:function(t){var e,n={},r=S(t.lists);try{for(r.s();!(e=r.n()).done;){var i,a=e.value,o={},s=S(a.items);try{for(s.s();!(i=s.n()).done;){var l=m(i.value,2),u=l[0],c=l[1],h=M.fromSerializedKey(u);if(null===h.itemName)return L("item.itemName");o[h.itemName]=c;}}catch(t){s.e(t);}finally{s.f();}n[a.name]=o;}}catch(t){r.e(t);}finally{r.f();}return n}},{key:"JTokenToListDefinitions",value:function(t){var e=t,n=[];for(var r in e)if(e.hasOwnProperty(r)){var i=r.toString(),a=e[r],o=new Map;for(var s in a)if(e.hasOwnProperty(r)){var l=a[s];o.set(s,parseInt(l));}var u=new Kt(i,o);n.push(u);}return new fe(n)}}]),t}();de._controlCommandNames=function(){var t=[];t[et.CommandType.EvalStart]="ev",t[et.CommandType.EvalOutput]="out",t[et.CommandType.EvalEnd]="/ev",t[et.CommandType.Duplicate]="du",t[et.CommandType.PopEvaluatedValue]="pop",t[et.CommandType.PopFunction]="~ret",t[et.CommandType.PopTunnel]="->->",t[et.CommandType.BeginString]="str",t[et.CommandType.EndString]="/str",t[et.CommandType.NoOp]="nop",t[et.CommandType.ChoiceCount]="choiceCnt",t[et.CommandType.Turns]="turn",t[et.CommandType.TurnsSince]="turns",t[et.CommandType.ReadCount]="readc",t[et.CommandType.Random]="rnd",t[et.CommandType.SeedRandom]="srnd",t[et.CommandType.VisitIndex]="visit",t[et.CommandType.SequenceShuffleIndex]="seq",t[et.CommandType.StartThread]="thread",t[et.CommandType.Done]="done",t[et.CommandType.End]="end",t[et.CommandType.ListFromInt]="listInt",t[et.CommandType.ListRange]="range",t[et.CommandType.ListRandom]="lrnd";for(var e=0;e<et.CommandType.TOTAL_VALUES;++e)if(null==t[e])throw new Error("Control command not accounted for in serialisation");return t}();var ve=function(){function e(){if(n(this,e),this._threadCounter=0,this._startOfRoot=dt.Null,arguments[0]instanceof t.Story){var r=arguments[0];this._startOfRoot=dt.StartOf(r.rootContentContainer),this.Reset();}else {var i=arguments[0];this._threads=[];var a,o=S(i._threads);try{for(o.s();!(a=o.n()).done;){var s=a.value;this._threads.push(s.Copy());}}catch(t){o.e(t);}finally{o.f();}this._threadCounter=i._threadCounter,this._startOfRoot=i._startOfRoot.copy();}}return i(e,[{key:"elements",get:function(){return this.callStack}},{key:"depth",get:function(){return this.elements.length}},{key:"currentElement",get:function(){var t=this._threads[this._threads.length-1].callstack;return t[t.length-1]}},{key:"currentElementIndex",get:function(){return this.callStack.length-1}},{key:"currentThread",get:function(){return this._threads[this._threads.length-1]},set:function(t){I.Assert(1==this._threads.length,"Shouldn't be directly setting the current thread when we have a stack of them"),this._threads.length=0,this._threads.push(t);}},{key:"canPop",get:function(){return this.callStack.length>1}},{key:"Reset",value:function(){this._threads=[],this._threads.push(new e.Thread),this._threads[0].callstack.push(new e.Element(ct.Tunnel,this._startOfRoot));}},{key:"SetJsonToken",value:function(t,n){this._threads.length=0;var r,i=S(t.threads);try{for(i.s();!(r=i.n()).done;){var a=r.value,o=new e.Thread(a,n);this._threads.push(o);}}catch(t){i.e(t);}finally{i.f();}this._threadCounter=parseInt(t.threadCounter),this._startOfRoot=dt.StartOf(n.rootContentContainer);}},{key:"WriteJson",value:function(t){var e=this;t.WriteObject((function(t){t.WritePropertyStart("threads"),t.WriteArrayStart();var n,r=S(e._threads);try{for(r.s();!(n=r.n()).done;){n.value.WriteJson(t);}}catch(t){r.e(t);}finally{r.f();}t.WriteArrayEnd(),t.WritePropertyEnd(),t.WritePropertyStart("threadCounter"),t.WriteInt(e._threadCounter),t.WritePropertyEnd();}));}},{key:"PushThread",value:function(){var t=this.currentThread.Copy();this._threadCounter++,t.threadIndex=this._threadCounter,this._threads.push(t);}},{key:"ForkThread",value:function(){var t=this.currentThread.Copy();return this._threadCounter++,t.threadIndex=this._threadCounter,t}},{key:"PopThread",value:function(){if(!this.canPopThread)throw new Error("Can't pop thread");this._threads.splice(this._threads.indexOf(this.currentThread),1);}},{key:"canPopThread",get:function(){return this._threads.length>1&&!this.elementIsEvaluateFromGame}},{key:"elementIsEvaluateFromGame",get:function(){return this.currentElement.type==ct.FunctionEvaluationFromGame}},{key:"Push",value:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,i=new e.Element(t,this.currentElement.currentPointer,!1);i.evaluationStackHeightWhenPushed=n,i.functionStartInOutputStream=r,this.callStack.push(i);}},{key:"CanPop",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;return !!this.canPop&&(null==t||this.currentElement.type==t)}},{key:"Pop",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;if(!this.CanPop(t))throw new Error("Mismatched push/pop in Callstack");this.callStack.pop();}},{key:"GetTemporaryVariableWithName",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1;-1==e&&(e=this.currentElementIndex+1);var n=this.callStack[e-1],r=q(n.temporaryVariables,t,null);return r.exists?r.result:null}},{key:"SetTemporaryVariable",value:function(t,e,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:-1;-1==r&&(r=this.currentElementIndex+1);var i=this.callStack[r-1];if(!n&&!i.temporaryVariables.get(t))throw new Error("Could not find temporary variable to set: "+t);var a=q(i.temporaryVariables,t,null);a.exists&&Z.RetainListOriginsForAssignment(a.result,e),i.temporaryVariables.set(t,e);}},{key:"ContextForVariableNamed",value:function(t){return this.currentElement.temporaryVariables.get(t)?this.currentElementIndex+1:0}},{key:"ThreadWithIndex",value:function(t){var e=this._threads.filter((function(e){if(e.threadIndex==t)return e}));return e.length>0?e[0]:null}},{key:"callStack",get:function(){return this.currentThread.callstack}},{key:"callStackTrace",get:function(){for(var t=new j,e=0;e<this._threads.length;e++){var n=this._threads[e],r=e==this._threads.length-1;t.AppendFormat("=== THREAD {0}/{1} {2}===\n",e+1,this._threads.length,r?"(current) ":"");for(var i=0;i<n.callstack.length;i++){n.callstack[i].type==ct.Function?t.Append("  [FUNCTION] "):t.Append("  [TUNNEL] ");var a=n.callstack[i].currentPointer;if(!a.isNull){if(t.Append("<SOMEWHERE IN "),null===a.container)return L("pointer.container");t.Append(a.container.path.toString()),t.AppendLine(">");}}}return t.toString()}}]),e}();!function(t){var e=function(){function t(e,r){var i=arguments.length>2&&void 0!==arguments[2]&&arguments[2];n(this,t),this.evaluationStackHeightWhenPushed=0,this.functionStartInOutputStream=0,this.currentPointer=r.copy(),this.inExpressionEvaluation=i,this.temporaryVariables=new Map,this.type=e;}return i(t,[{key:"Copy",value:function(){var e=new t(this.type,this.currentPointer,this.inExpressionEvaluation);return e.temporaryVariables=new Map(this.temporaryVariables),e.evaluationStackHeightWhenPushed=this.evaluationStackHeightWhenPushed,e.functionStartInOutputStream=this.functionStartInOutputStream,e}}]),t}();t.Element=e;var r=function(){function t(){if(n(this,t),this.threadIndex=0,this.previousPointer=dt.Null,this.callstack=[],arguments[0]&&arguments[1]){var r=arguments[0],i=arguments[1];this.threadIndex=parseInt(r.threadIndex);var a,o=r.callstack,s=S(o);try{for(s.s();!(a=s.n()).done;){var l=a.value,u=l,c=parseInt(u.type),h=dt.Null,f=void 0,d=u.cPath;if(void 0!==d){f=d.toString();var v=i.ContentAtPath(new R(f));if(h.container=v.container,h.index=parseInt(u.idx),null==v.obj)throw new Error("When loading state, internal story location couldn't be found: "+f+". Has the story changed since this save data was created?");if(v.approximate){if(null===h.container)return L("pointer.container");i.Warning("When loading state, exact internal story location couldn't be found: '"+f+"', so it was approximated to '"+h.container.path.toString()+"' to recover. Has the story changed since this save data was created?");}}var p=!!u.exp,m=new e(c,h,p),y=u.temp;void 0!==y?m.temporaryVariables=de.JObjectToDictionaryRuntimeObjs(y):m.temporaryVariables.clear(),this.callstack.push(m);}}catch(t){s.e(t);}finally{s.f();}var g=r.previousContentObject;if(void 0!==g){var C=new R(g.toString());this.previousPointer=i.PointerAtPath(C);}}}return i(t,[{key:"Copy",value:function(){var e=new t;e.threadIndex=this.threadIndex;var n,r=S(this.callstack);try{for(r.s();!(n=r.n()).done;){var i=n.value;e.callstack.push(i.Copy());}}catch(t){r.e(t);}finally{r.f();}return e.previousPointer=this.previousPointer.copy(),e}},{key:"WriteJson",value:function(t){t.WriteObjectStart(),t.WritePropertyStart("callstack"),t.WriteArrayStart();var e,n=S(this.callstack);try{for(n.s();!(e=n.n()).done;){var r=e.value;if(t.WriteObjectStart(),!r.currentPointer.isNull){if(null===r.currentPointer.container)return L("el.currentPointer.container");t.WriteProperty("cPath",r.currentPointer.container.path.componentsString),t.WriteIntProperty("idx",r.currentPointer.index);}t.WriteProperty("exp",r.inExpressionEvaluation),t.WriteIntProperty("type",r.type),r.temporaryVariables.size>0&&(t.WritePropertyStart("temp"),de.WriteDictionaryRuntimeObjs(t,r.temporaryVariables),t.WritePropertyEnd()),t.WriteObjectEnd();}}catch(t){n.e(t);}finally{n.f();}if(t.WriteArrayEnd(),t.WritePropertyEnd(),t.WriteIntProperty("threadIndex",this.threadIndex),!this.previousPointer.isNull){var i=this.previousPointer.Resolve();if(null===i)return L("this.previousPointer.Resolve()");t.WriteProperty("previousContentObject",i.path.toString());}t.WriteObjectEnd();}}]),t}();t.Thread=r;}(ve||(ve={}));var pe=function(){function t(e,r){n(this,t),this.variableChangedEventCallbacks=[],this.patch=null,this._batchObservingVariableChanges=!1,this._defaultGlobalVariables=new Map,this._changedVariablesForBatchObs=new Set,this._globalVariables=new Map,this._callStack=e,this._listDefsOrigin=r;try{return new Proxy(this,{get:function(t,e){return e in t?t[e]:t.$(e)},set:function(t,e,n){return e in t?t[e]=n:t.$(e,n),!0}})}catch(t){}}return i(t,[{key:"variableChangedEvent",value:function(t,e){var n,r=S(this.variableChangedEventCallbacks);try{for(r.s();!(n=r.n()).done;){(0,n.value)(t,e);}}catch(t){r.e(t);}finally{r.f();}}},{key:"batchObservingVariableChanges",get:function(){return this._batchObservingVariableChanges},set:function(t){if(this._batchObservingVariableChanges=t,t)this._changedVariablesForBatchObs=new Set;else if(null!=this._changedVariablesForBatchObs){var e,n=S(this._changedVariablesForBatchObs);try{for(n.s();!(e=n.n()).done;){var r=e.value,i=this._globalVariables.get(r);i?this.variableChangedEvent(r,i):L("currentValue");}}catch(t){n.e(t);}finally{n.f();}this._changedVariablesForBatchObs=null;}}},{key:"callStack",get:function(){return this._callStack},set:function(t){this._callStack=t;}},{key:"$",value:function(t,e){if(void 0===e){var n=null;return null!==this.patch&&(n=this.patch.TryGetGlobal(t,null)).exists?n.result.valueObject:(void 0===(n=this._globalVariables.get(t))&&(n=this._defaultGlobalVariables.get(t)),void 0!==n?n.valueObject:null)}if(void 0===this._defaultGlobalVariables.get(t))throw new G("Cannot assign to a variable ("+t+") that hasn't been declared in the story");var r=K.Create(e);if(null==r)throw null==e?new Error("Cannot pass null to VariableState"):new Error("Invalid value passed to VariableState: "+e.toString());this.SetGlobal(t,r);}},{key:"ApplyPatch",value:function(){if(null===this.patch)return L("this.patch");var t,e=S(this.patch.globals);try{for(e.s();!(t=e.n()).done;){var n=m(t.value,2),r=n[0],i=n[1];this._globalVariables.set(r,i);}}catch(t){e.e(t);}finally{e.f();}if(null!==this._changedVariablesForBatchObs){var a,o=S(this.patch.changedVariables);try{for(o.s();!(a=o.n()).done;){var s=a.value;this._changedVariablesForBatchObs.add(s);}}catch(t){o.e(t);}finally{o.f();}}this.patch=null;}},{key:"SetJsonToken",value:function(t){this._globalVariables.clear();var e,n=S(this._defaultGlobalVariables);try{for(n.s();!(e=n.n()).done;){var r=m(e.value,2),i=r[0],a=r[1],o=t[i];if(void 0!==o){var s=de.JTokenToRuntimeObject(o);if(null===s)return L("tokenInkObject");this._globalVariables.set(i,s);}else this._globalVariables.set(i,a);}}catch(t){n.e(t);}finally{n.f();}}},{key:"WriteJson",value:function(e){e.WriteObjectStart();var n,r=S(this._globalVariables);try{for(r.s();!(n=r.n()).done;){var i=m(n.value,2),a=i[0],o=i[1],s=a,l=o;if(t.dontSaveDefaultValues&&this._defaultGlobalVariables.has(s)){var u=this._defaultGlobalVariables.get(s);if(this.RuntimeObjectsEqual(l,u))continue}e.WritePropertyStart(s),de.WriteRuntimeObject(e,l),e.WritePropertyEnd();}}catch(t){r.e(t);}finally{r.f();}e.WriteObjectEnd();}},{key:"RuntimeObjectsEqual",value:function(t,e){if(null===t)return L("obj1");if(null===e)return L("obj2");if(t.constructor!==e.constructor)return !1;var n=_(t,H);if(null!==n)return n.value===A(e,H).value;var r=_(t,J);if(null!==r)return r.value===A(e,J).value;var i=_(t,z);if(null!==i)return i.value===A(e,z).value;var a=_(t,K),o=_(e,K);if(null!==a&&null!==o)return x(a.valueObject)&&x(o.valueObject)?a.valueObject.Equals(o.valueObject):a.valueObject===o.valueObject;throw new Error("FastRoughDefinitelyEquals: Unsupported runtime object type: "+t.constructor.name)}},{key:"GetVariableWithName",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1,n=this.GetRawVariableWithName(t,e),r=_(n,Y);return null!==r&&(n=this.ValueAtVariablePointer(r)),n}},{key:"TryGetDefaultVariableValue",value:function(t){var e=q(this._defaultGlobalVariables,t,null);return e.exists?e.result:null}},{key:"GlobalVariableExistsWithName",value:function(t){return this._globalVariables.has(t)||null!==this._defaultGlobalVariables&&this._defaultGlobalVariables.has(t)}},{key:"GetRawVariableWithName",value:function(t,e){if(0==e||-1==e){var n=null;if(null!==this.patch&&(n=this.patch.TryGetGlobal(t,null)).exists)return n.result;if((n=q(this._globalVariables,t,null)).exists)return n.result;if(null!==this._defaultGlobalVariables&&(n=q(this._defaultGlobalVariables,t,null)).exists)return n.result;if(null===this._listDefsOrigin)return L("VariablesState._listDefsOrigin");var r=this._listDefsOrigin.FindSingleItemListWithName(t);if(r)return r}return this._callStack.GetTemporaryVariableWithName(t,e)}},{key:"ValueAtVariablePointer",value:function(t){return this.GetVariableWithName(t.variableName,t.contextIndex)}},{key:"Assign",value:function(t,e){var n=t.variableName;if(null===n)return L("name");var r=-1,i=!1;if(i=t.isNewDeclaration?t.isGlobal:this.GlobalVariableExistsWithName(n),t.isNewDeclaration){var a=_(e,Y);if(null!==a)e=this.ResolveVariablePointer(a);}else {var o=null;do{null!=(o=_(this.GetRawVariableWithName(n,r),Y))&&(n=o.variableName,i=0==(r=o.contextIndex));}while(null!=o)}i?this.SetGlobal(n,e):this._callStack.SetTemporaryVariable(n,e,t.isNewDeclaration,r);}},{key:"SnapshotDefaultGlobals",value:function(){this._defaultGlobalVariables=new Map(this._globalVariables);}},{key:"RetainListOriginsForAssignment",value:function(t,e){var n=A(t,Z),r=A(e,Z);n.value&&r.value&&0==r.value.Count&&r.value.SetInitialOriginNames(n.value.originNames);}},{key:"SetGlobal",value:function(t,e){var n=null;if(null===this.patch&&(n=q(this._globalVariables,t,null)),null!==this.patch&&((n=this.patch.TryGetGlobal(t,null)).exists||(n=q(this._globalVariables,t,null))),Z.RetainListOriginsForAssignment(n.result,e),null===t)return L("variableName");if(null!==this.patch?this.patch.SetGlobal(t,e):this._globalVariables.set(t,e),null!==this.variableChangedEvent&&null!==n&&e!==n.result)if(this.batchObservingVariableChanges){if(null===this._changedVariablesForBatchObs)return L("this._changedVariablesForBatchObs");null!==this.patch?this.patch.AddChangedVariable(t):null!==this._changedVariablesForBatchObs&&this._changedVariablesForBatchObs.add(t);}else this.variableChangedEvent(t,e);}},{key:"ResolveVariablePointer",value:function(t){var e=t.contextIndex;-1==e&&(e=this.GetContextIndexOfVariableNamed(t.variableName));var n=_(this.GetRawVariableWithName(t.variableName,e),Y);return null!=n?n:new Y(t.variableName,e)}},{key:"GetContextIndexOfVariableNamed",value:function(t){return this.GlobalVariableExistsWithName(t)?0:this._callStack.currentElementIndex}},{key:"ObserveVariableChange",value:function(t){this.variableChangedEventCallbacks.push(t);}}]),t}();pe.dontSaveDefaultValues=!0;var me=function(){function t(e){n(this,t),this.seed=e%2147483647,this.seed<=0&&(this.seed+=2147483646);}return i(t,[{key:"next",value:function(){return this.seed=48271*this.seed%2147483647}},{key:"nextFloat",value:function(){return (this.next()-1)/2147483646}}]),t}(),ye=function(){function t(){if(n(this,t),this._changedVariables=new Set,this._visitCounts=new Map,this._turnIndices=new Map,1===arguments.length&&null!==arguments[0]){var e=arguments[0];this._globals=new Map(e._globals),this._changedVariables=new Set(e._changedVariables),this._visitCounts=new Map(e._visitCounts),this._turnIndices=new Map(e._turnIndices);}else this._globals=new Map,this._changedVariables=new Set,this._visitCounts=new Map,this._turnIndices=new Map;}return i(t,[{key:"globals",get:function(){return this._globals}},{key:"changedVariables",get:function(){return this._changedVariables}},{key:"visitCounts",get:function(){return this._visitCounts}},{key:"turnIndices",get:function(){return this._turnIndices}},{key:"TryGetGlobal",value:function(t,e){return null!==t&&this._globals.has(t)?{result:this._globals.get(t),exists:!0}:{result:e,exists:!1}}},{key:"SetGlobal",value:function(t,e){this._globals.set(t,e);}},{key:"AddChangedVariable",value:function(t){return this._changedVariables.add(t)}},{key:"TryGetVisitCount",value:function(t,e){return this._visitCounts.has(t)?{result:this._visitCounts.get(t),exists:!0}:{result:e,exists:!1}}},{key:"SetVisitCount",value:function(t,e){this._visitCounts.set(t,e);}},{key:"SetTurnIndex",value:function(t,e){this._turnIndices.set(t,e);}},{key:"TryGetTurnIndex",value:function(t,e){return this._turnIndices.has(t)?{result:this._turnIndices.get(t),exists:!0}:{result:e,exists:!1}}}]),t}(),ge=function(){function t(){n(this,t);}return i(t,null,[{key:"TextToDictionary",value:function(e){return new t.Reader(e).ToDictionary()}},{key:"TextToArray",value:function(e){return new t.Reader(e).ToArray()}}]),t}();!function(t){var e=function(){function t(e){n(this,t),this._rootObject=JSON.parse(e);}return i(t,[{key:"ToDictionary",value:function(){return this._rootObject}},{key:"ToArray",value:function(){return this._rootObject}}]),t}();t.Reader=e;var r=function(){function e(){n(this,e),this._currentPropertyName=null,this._currentString=null,this._stateStack=[],this._collectionStack=[],this._propertyNameStack=[],this._jsonObject=null;}return i(e,[{key:"WriteObject",value:function(t){this.WriteObjectStart(),t(this),this.WriteObjectEnd();}},{key:"WriteObjectStart",value:function(){this.StartNewObject(!0);var e={};if(this.state===t.Writer.State.Property){this.Assert(null!==this.currentCollection),this.Assert(null!==this.currentPropertyName);var n=this._propertyNameStack.pop();this.currentCollection[n]=e,this._collectionStack.push(e);}else this.state===t.Writer.State.Array?(this.Assert(null!==this.currentCollection),this.currentCollection.push(e),this._collectionStack.push(e)):(this.Assert(this.state===t.Writer.State.None),this._jsonObject=e,this._collectionStack.push(e));this._stateStack.push(new t.Writer.StateElement(t.Writer.State.Object));}},{key:"WriteObjectEnd",value:function(){this.Assert(this.state===t.Writer.State.Object),this._collectionStack.pop(),this._stateStack.pop();}},{key:"WriteProperty",value:function(t,e){if(this.WritePropertyStart(t),arguments[1]instanceof Function){var n=arguments[1];n(this);}else {var r=arguments[1];this.Write(r);}this.WritePropertyEnd();}},{key:"WriteIntProperty",value:function(t,e){this.WritePropertyStart(t),this.WriteInt(e),this.WritePropertyEnd();}},{key:"WriteFloatProperty",value:function(t,e){this.WritePropertyStart(t),this.WriteFloat(e),this.WritePropertyEnd();}},{key:"WritePropertyStart",value:function(e){this.Assert(this.state===t.Writer.State.Object),this._propertyNameStack.push(e),this.IncrementChildCount(),this._stateStack.push(new t.Writer.StateElement(t.Writer.State.Property));}},{key:"WritePropertyEnd",value:function(){this.Assert(this.state===t.Writer.State.Property),this.Assert(1===this.childCount),this._stateStack.pop();}},{key:"WritePropertyNameStart",value:function(){this.Assert(this.state===t.Writer.State.Object),this.IncrementChildCount(),this._currentPropertyName="",this._stateStack.push(new t.Writer.StateElement(t.Writer.State.Property)),this._stateStack.push(new t.Writer.StateElement(t.Writer.State.PropertyName));}},{key:"WritePropertyNameEnd",value:function(){this.Assert(this.state===t.Writer.State.PropertyName),this.Assert(null!==this._currentPropertyName),this._propertyNameStack.push(this._currentPropertyName),this._currentPropertyName=null,this._stateStack.pop();}},{key:"WritePropertyNameInner",value:function(e){this.Assert(this.state===t.Writer.State.PropertyName),this.Assert(null!==this._currentPropertyName),this._currentPropertyName+=e;}},{key:"WriteArrayStart",value:function(){this.StartNewObject(!0);var e=[];if(this.state===t.Writer.State.Property){this.Assert(null!==this.currentCollection),this.Assert(null!==this.currentPropertyName);var n=this._propertyNameStack.pop();this.currentCollection[n]=e,this._collectionStack.push(e);}else this.state===t.Writer.State.Array?(this.Assert(null!==this.currentCollection),this.currentCollection.push(e),this._collectionStack.push(e)):(this.Assert(this.state===t.Writer.State.None),this._jsonObject=e,this._collectionStack.push(e));this._stateStack.push(new t.Writer.StateElement(t.Writer.State.Array));}},{key:"WriteArrayEnd",value:function(){this.Assert(this.state===t.Writer.State.Array),this._collectionStack.pop(),this._stateStack.pop();}},{key:"Write",value:function(t){null!==t?(this.StartNewObject(!1),this._addToCurrentObject(t)):console.error("Warning: trying to write a null value");}},{key:"WriteBool",value:function(t){null!==t&&(this.StartNewObject(!1),this._addToCurrentObject(t));}},{key:"WriteInt",value:function(t){null!==t&&(this.StartNewObject(!1),this._addToCurrentObject(Math.floor(t)));}},{key:"WriteFloat",value:function(t){null!==t&&(this.StartNewObject(!1),t==Number.POSITIVE_INFINITY?this._addToCurrentObject(34e37):t==Number.NEGATIVE_INFINITY?this._addToCurrentObject(-34e37):isNaN(t)?this._addToCurrentObject(0):this._addToCurrentObject(t));}},{key:"WriteNull",value:function(){this.StartNewObject(!1),this._addToCurrentObject(null);}},{key:"WriteStringStart",value:function(){this.StartNewObject(!1),this._currentString="",this._stateStack.push(new t.Writer.StateElement(t.Writer.State.String));}},{key:"WriteStringEnd",value:function(){this.Assert(this.state==t.Writer.State.String),this._stateStack.pop(),this._addToCurrentObject(this._currentString),this._currentString=null;}},{key:"WriteStringInner",value:function(e){this.Assert(this.state===t.Writer.State.String),null!==e?this._currentString+=e:console.error("Warning: trying to write a null string");}},{key:"toString",value:function(){return null===this._jsonObject?"":JSON.stringify(this._jsonObject)}},{key:"StartNewObject",value:function(e){e?this.Assert(this.state===t.Writer.State.None||this.state===t.Writer.State.Property||this.state===t.Writer.State.Array):this.Assert(this.state===t.Writer.State.Property||this.state===t.Writer.State.Array),this.state===t.Writer.State.Property&&this.Assert(0===this.childCount),this.state!==t.Writer.State.Array&&this.state!==t.Writer.State.Property||this.IncrementChildCount();}},{key:"state",get:function(){return this._stateStack.length>0?this._stateStack[this._stateStack.length-1].type:t.Writer.State.None}},{key:"childCount",get:function(){return this._stateStack.length>0?this._stateStack[this._stateStack.length-1].childCount:0}},{key:"currentCollection",get:function(){return this._collectionStack.length>0?this._collectionStack[this._collectionStack.length-1]:null}},{key:"currentPropertyName",get:function(){return this._propertyNameStack.length>0?this._propertyNameStack[this._propertyNameStack.length-1]:null}},{key:"IncrementChildCount",value:function(){this.Assert(this._stateStack.length>0);var t=this._stateStack.pop();t.childCount++,this._stateStack.push(t);}},{key:"Assert",value:function(t){if(!t)throw Error("Assert failed while writing JSON")}},{key:"_addToCurrentObject",value:function(e){this.Assert(null!==this.currentCollection),this.state===t.Writer.State.Array?(this.Assert(Array.isArray(this.currentCollection)),this.currentCollection.push(e)):this.state===t.Writer.State.Property&&(this.Assert(!Array.isArray(this.currentCollection)),this.Assert(null!==this.currentPropertyName),this.currentCollection[this.currentPropertyName]=e,this._propertyNameStack.pop());}}]),e}();t.Writer=r,function(e){var r;(r=e.State||(e.State={}))[r.None=0]="None",r[r.Object=1]="Object",r[r.Array=2]="Array",r[r.Property=3]="Property",r[r.PropertyName=4]="PropertyName",r[r.String=5]="String";var a=i((function e(r){n(this,e),this.type=t.Writer.State.None,this.childCount=0,this.type=r;}));e.StateElement=a;}(r=t.Writer||(t.Writer={}));}(ge||(ge={}));var Ce,Se=function(){function t(){n(this,t);var e=arguments[0],r=arguments[1];if(this.name=e,this.callStack=new ve(r),arguments[2]){var i=arguments[2];this.callStack.SetJsonToken(i.callstack,r),this.outputStream=de.JArrayToRuntimeObjList(i.outputStream),this.currentChoices=de.JArrayToRuntimeObjList(i.currentChoices);var a=i.choiceThreads;void 0!==a&&this.LoadFlowChoiceThreads(a,r);}else this.outputStream=[],this.currentChoices=[];}return i(t,[{key:"WriteJson",value:function(t){var e=this;t.WriteObjectStart(),t.WriteProperty("callstack",(function(t){return e.callStack.WriteJson(t)})),t.WriteProperty("outputStream",(function(t){return de.WriteListRuntimeObjs(t,e.outputStream)}));var n,r=!1,i=S(this.currentChoices);try{for(i.s();!(n=i.n()).done;){var a=n.value;if(null===a.threadAtGeneration)return L("c.threadAtGeneration");a.originalThreadIndex=a.threadAtGeneration.threadIndex,null===this.callStack.ThreadWithIndex(a.originalThreadIndex)&&(r||(r=!0,t.WritePropertyStart("choiceThreads"),t.WriteObjectStart()),t.WritePropertyStart(a.originalThreadIndex),a.threadAtGeneration.WriteJson(t),t.WritePropertyEnd());}}catch(t){i.e(t);}finally{i.f();}r&&(t.WriteObjectEnd(),t.WritePropertyEnd()),t.WriteProperty("currentChoices",(function(t){t.WriteArrayStart();var n,r=S(e.currentChoices);try{for(r.s();!(n=r.n()).done;){var i=n.value;de.WriteChoice(t,i);}}catch(t){r.e(t);}finally{r.f();}t.WriteArrayEnd();})),t.WriteObjectEnd();}},{key:"LoadFlowChoiceThreads",value:function(t,e){var n,r=S(this.currentChoices);try{for(r.s();!(n=r.n()).done;){var i=n.value,a=this.callStack.ThreadWithIndex(i.originalThreadIndex);if(null!==a)i.threadAtGeneration=a.Copy();else {var o=t["".concat(i.originalThreadIndex)];i.threadAtGeneration=new ve.Thread(o,e);}}}catch(t){r.e(t);}finally{r.f();}}}]),t}(),be=function(){function e(t){n(this,e),this.kInkSaveStateVersion=9,this.kMinCompatibleLoadVersion=8,this.onDidLoadState=null,this._currentErrors=null,this._currentWarnings=null,this.divertedPointer=dt.Null,this._currentTurnIndex=0,this.storySeed=0,this.previousRandom=0,this.didSafeExit=!1,this._currentText=null,this._currentTags=null,this._outputStreamTextDirty=!0,this._outputStreamTagsDirty=!0,this._patch=null,this._namedFlows=null,this.kDefaultFlowName="DEFAULT_FLOW",this.story=t,this._currentFlow=new Se(this.kDefaultFlowName,t),this.OutputStreamDirty(),this._evaluationStack=[],this._variablesState=new pe(this.callStack,t.listDefinitions),this._visitCounts=new Map,this._turnIndices=new Map,this.currentTurnIndex=-1;var r=(new Date).getTime();this.storySeed=new me(r).next()%100,this.previousRandom=0,this.GoToStart();}return i(e,[{key:"ToJson",value:function(){var t=new ge.Writer;return this.WriteJson(t),t.toString()}},{key:"toJson",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return this.ToJson(t)}},{key:"LoadJson",value:function(t){var e=ge.TextToDictionary(t);this.LoadJsonObj(e),null!==this.onDidLoadState&&this.onDidLoadState();}},{key:"VisitCountAtPathString",value:function(t){var e;if(null!==this._patch){var n=this.story.ContentAtPath(new R(t)).container;if(null===n)throw new Error("Content at path not found: "+t);if((e=this._patch.TryGetVisitCount(n,0)).exists)return e.result}return (e=q(this._visitCounts,t,null)).exists?e.result:0}},{key:"VisitCountForContainer",value:function(t){if(null===t)return L("container");if(!t.visitsShouldBeCounted)return this.story.Error("Read count for target ("+t.name+" - on "+t.debugMetadata+") unknown. The story may need to be compiled with countAllVisits flag (-c)."),0;if(null!==this._patch){var e=this._patch.TryGetVisitCount(t,0);if(e.exists)return e.result}var n=t.path.toString(),r=q(this._visitCounts,n,null);return r.exists?r.result:0}},{key:"IncrementVisitCountForContainer",value:function(t){if(null!==this._patch){var e=this.VisitCountForContainer(t);return e++,void this._patch.SetVisitCount(t,e)}var n=t.path.toString(),r=q(this._visitCounts,n,null);r.exists?this._visitCounts.set(n,r.result+1):this._visitCounts.set(n,1);}},{key:"RecordTurnIndexVisitToContainer",value:function(t){if(null===this._patch){var e=t.path.toString();this._turnIndices.set(e,this.currentTurnIndex);}else this._patch.SetTurnIndex(t,this.currentTurnIndex);}},{key:"TurnsSinceForContainer",value:function(t){if(t.turnIndexShouldBeCounted||this.story.Error("TURNS_SINCE() for target ("+t.name+" - on "+t.debugMetadata+") unknown. The story may need to be compiled with countAllVisits flag (-c)."),null!==this._patch){var e=this._patch.TryGetTurnIndex(t,0);if(e.exists)return this.currentTurnIndex-e.result}var n=t.path.toString(),r=q(this._turnIndices,n,0);return r.exists?this.currentTurnIndex-r.result:-1}},{key:"callstackDepth",get:function(){return this.callStack.depth}},{key:"outputStream",get:function(){return this._currentFlow.outputStream}},{key:"currentChoices",get:function(){return this.canContinue?[]:this._currentFlow.currentChoices}},{key:"generatedChoices",get:function(){return this._currentFlow.currentChoices}},{key:"currentErrors",get:function(){return this._currentErrors}},{key:"currentWarnings",get:function(){return this._currentWarnings}},{key:"variablesState",get:function(){return this._variablesState},set:function(t){this._variablesState=t;}},{key:"callStack",get:function(){return this._currentFlow.callStack}},{key:"evaluationStack",get:function(){return this._evaluationStack}},{key:"currentTurnIndex",get:function(){return this._currentTurnIndex},set:function(t){this._currentTurnIndex=t;}},{key:"currentPathString",get:function(){var t=this.currentPointer;return t.isNull?null:null===t.path?L("pointer.path"):t.path.toString()}},{key:"currentPointer",get:function(){return this.callStack.currentElement.currentPointer.copy()},set:function(t){this.callStack.currentElement.currentPointer=t.copy();}},{key:"previousPointer",get:function(){return this.callStack.currentThread.previousPointer.copy()},set:function(t){this.callStack.currentThread.previousPointer=t.copy();}},{key:"canContinue",get:function(){return !this.currentPointer.isNull&&!this.hasError}},{key:"hasError",get:function(){return null!=this.currentErrors&&this.currentErrors.length>0}},{key:"hasWarning",get:function(){return null!=this.currentWarnings&&this.currentWarnings.length>0}},{key:"currentText",get:function(){if(this._outputStreamTextDirty){var t,e=new j,n=S(this.outputStream);try{for(n.s();!(t=n.n()).done;){var r=_(t.value,$);null!==r&&e.Append(r.value);}}catch(t){n.e(t);}finally{n.f();}this._currentText=this.CleanOutputWhitespace(e.toString()),this._outputStreamTextDirty=!1;}return this._currentText}},{key:"CleanOutputWhitespace",value:function(t){for(var e=new j,n=-1,r=0,i=0;i<t.length;i++){var a=t.charAt(i),o=" "==a||"\t"==a;o&&-1==n&&(n=i),o||("\n"!=a&&n>0&&n!=r&&e.Append(" "),n=-1),"\n"==a&&(r=i+1),o||e.Append(a);}return e.toString()}},{key:"currentTags",get:function(){if(this._outputStreamTagsDirty){this._currentTags=[];var t,e=S(this.outputStream);try{for(e.s();!(t=e.n()).done;){var n=_(t.value,ce);null!==n&&this._currentTags.push(n.text);}}catch(t){e.e(t);}finally{e.f();}this._outputStreamTagsDirty=!1;}return this._currentTags}},{key:"currentFlowName",get:function(){return this._currentFlow.name}},{key:"inExpressionEvaluation",get:function(){return this.callStack.currentElement.inExpressionEvaluation},set:function(t){this.callStack.currentElement.inExpressionEvaluation=t;}},{key:"GoToStart",value:function(){this.callStack.currentElement.currentPointer=dt.StartOf(this.story.mainContentContainer);}},{key:"SwitchFlow_Internal",value:function(t){if(null===t)throw new Error("Must pass a non-null string to Story.SwitchFlow");if(null===this._namedFlows&&(this._namedFlows=new Map,this._namedFlows.set(this.kDefaultFlowName,this._currentFlow)),t!==this._currentFlow.name){var e,n=q(this._namedFlows,t,null);n.exists?e=n.result:(e=new Se(t,this.story),this._namedFlows.set(t,e)),this._currentFlow=e,this.variablesState.callStack=this._currentFlow.callStack,this.OutputStreamDirty();}}},{key:"SwitchToDefaultFlow_Internal",value:function(){null!==this._namedFlows&&this.SwitchFlow_Internal(this.kDefaultFlowName);}},{key:"RemoveFlow_Internal",value:function(t){if(null===t)throw new Error("Must pass a non-null string to Story.DestroyFlow");if(t===this.kDefaultFlowName)throw new Error("Cannot destroy default flow");if(this._currentFlow.name===t&&this.SwitchToDefaultFlow_Internal(),null===this._namedFlows)return L("this._namedFlows");this._namedFlows.delete(t);}},{key:"CopyAndStartPatching",value:function(){var t,n,r,i,a,o=new e(this.story);if(o._patch=new ye(this._patch),o._currentFlow.name=this._currentFlow.name,o._currentFlow.callStack=new ve(this._currentFlow.callStack),(t=o._currentFlow.currentChoices).push.apply(t,y(this._currentFlow.currentChoices)),(n=o._currentFlow.outputStream).push.apply(n,y(this._currentFlow.outputStream)),o.OutputStreamDirty(),null!==this._namedFlows){o._namedFlows=new Map;var s,l=S(this._namedFlows);try{for(l.s();!(s=l.n()).done;){var u=m(s.value,2),c=u[0],h=u[1];o._namedFlows.set(c,h);}}catch(t){l.e(t);}finally{l.f();}o._namedFlows.set(this._currentFlow.name,o._currentFlow);}this.hasError&&(o._currentErrors=[],(i=o._currentErrors).push.apply(i,y(this.currentErrors||[])));this.hasWarning&&(o._currentWarnings=[],(a=o._currentWarnings).push.apply(a,y(this.currentWarnings||[])));return o.variablesState=this.variablesState,o.variablesState.callStack=o.callStack,o.variablesState.patch=o._patch,(r=o.evaluationStack).push.apply(r,y(this.evaluationStack)),this.divertedPointer.isNull||(o.divertedPointer=this.divertedPointer.copy()),o.previousPointer=this.previousPointer.copy(),o._visitCounts=this._visitCounts,o._turnIndices=this._turnIndices,o.currentTurnIndex=this.currentTurnIndex,o.storySeed=this.storySeed,o.previousRandom=this.previousRandom,o.didSafeExit=this.didSafeExit,o}},{key:"RestoreAfterPatch",value:function(){this.variablesState.callStack=this.callStack,this.variablesState.patch=this._patch;}},{key:"ApplyAnyPatch",value:function(){if(null!==this._patch){this.variablesState.ApplyPatch();var t,e=S(this._patch.visitCounts);try{for(e.s();!(t=e.n()).done;){var n=m(t.value,2),r=n[0],i=n[1];this.ApplyCountChanges(r,i,!0);}}catch(t){e.e(t);}finally{e.f();}var a,o=S(this._patch.turnIndices);try{for(o.s();!(a=o.n()).done;){var s=m(a.value,2),l=s[0],u=s[1];this.ApplyCountChanges(l,u,!1);}}catch(t){o.e(t);}finally{o.f();}this._patch=null;}}},{key:"ApplyCountChanges",value:function(t,e,n){(n?this._visitCounts:this._turnIndices).set(t.path.toString(),e);}},{key:"WriteJson",value:function(e){var n=this;if(e.WriteObjectStart(),e.WritePropertyStart("flows"),e.WriteObjectStart(),null!==this._namedFlows){var r,i=S(this._namedFlows);try{var a=function(){var t=m(r.value,2),n=t[0],i=t[1];e.WriteProperty(n,(function(t){return i.WriteJson(t)}));};for(i.s();!(r=i.n()).done;)a();}catch(t){i.e(t);}finally{i.f();}}else e.WriteProperty(this._currentFlow.name,(function(t){return n._currentFlow.WriteJson(t)}));if(e.WriteObjectEnd(),e.WritePropertyEnd(),e.WriteProperty("currentFlowName",this._currentFlow.name),e.WriteProperty("variablesState",(function(t){return n.variablesState.WriteJson(t)})),e.WriteProperty("evalStack",(function(t){return de.WriteListRuntimeObjs(t,n.evaluationStack)})),!this.divertedPointer.isNull){if(null===this.divertedPointer.path)return L("divertedPointer");e.WriteProperty("currentDivertTarget",this.divertedPointer.path.componentsString);}e.WriteProperty("visitCounts",(function(t){return de.WriteIntDictionary(t,n._visitCounts)})),e.WriteProperty("turnIndices",(function(t){return de.WriteIntDictionary(t,n._turnIndices)})),e.WriteIntProperty("turnIdx",this.currentTurnIndex),e.WriteIntProperty("storySeed",this.storySeed),e.WriteIntProperty("previousRandom",this.previousRandom),e.WriteIntProperty("inkSaveVersion",this.kInkSaveStateVersion),e.WriteIntProperty("inkFormatVersion",t.Story.inkVersionCurrent),e.WriteObjectEnd();}},{key:"LoadJsonObj",value:function(t){var e=t,n=e.inkSaveVersion;if(null==n)throw new Error("ink save format incorrect, can't load.");if(parseInt(n)<this.kMinCompatibleLoadVersion)throw new Error("Ink save format isn't compatible with the current version (saw '"+n+"', but minimum is "+this.kMinCompatibleLoadVersion+"), so can't load.");var r=e.flows;if(null!=r){var i=r;1===Object.keys(i).length?this._namedFlows=null:null===this._namedFlows?this._namedFlows=new Map:this._namedFlows.clear();for(var a=0,o=Object.entries(i);a<o.length;a++){var s=m(o[a],2),l=s[0],u=s[1],c=new Se(l,this.story,u);if(1===Object.keys(i).length)this._currentFlow=new Se(l,this.story,u);else {if(null===this._namedFlows)return L("this._namedFlows");this._namedFlows.set(l,c);}}if(null!=this._namedFlows&&this._namedFlows.size>1){var h=e.currentFlowName;this._currentFlow=this._namedFlows.get(h);}}else {this._namedFlows=null,this._currentFlow.name=this.kDefaultFlowName,this._currentFlow.callStack.SetJsonToken(e.callstackThreads,this.story),this._currentFlow.outputStream=de.JArrayToRuntimeObjList(e.outputStream),this._currentFlow.currentChoices=de.JArrayToRuntimeObjList(e.currentChoices);var f=e.choiceThreads;this._currentFlow.LoadFlowChoiceThreads(f,this.story);}this.OutputStreamDirty(),this.variablesState.SetJsonToken(e.variablesState),this.variablesState.callStack=this._currentFlow.callStack,this._evaluationStack=de.JArrayToRuntimeObjList(e.evalStack);var d=e.currentDivertTarget;if(null!=d){var v=new R(d.toString());this.divertedPointer=this.story.PointerAtPath(v);}this._visitCounts=de.JObjectToIntDictionary(e.visitCounts),this._turnIndices=de.JObjectToIntDictionary(e.turnIndices),this.currentTurnIndex=parseInt(e.turnIdx),this.storySeed=parseInt(e.storySeed),this.previousRandom=parseInt(e.previousRandom);}},{key:"ResetErrors",value:function(){this._currentErrors=null,this._currentWarnings=null;}},{key:"ResetOutput",value:function(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;this.outputStream.length=0,null!==e&&(t=this.outputStream).push.apply(t,y(e)),this.OutputStreamDirty();}},{key:"PushToOutputStream",value:function(t){var e=_(t,$);if(null!==e){var n=this.TrySplittingHeadTailWhitespace(e);if(null!==n){var r,i=S(n);try{for(i.s();!(r=i.n()).done;){var a=r.value;this.PushToOutputStreamIndividual(a);}}catch(t){i.e(t);}finally{i.f();}return void this.OutputStreamDirty()}}this.PushToOutputStreamIndividual(t),this.OutputStreamDirty();}},{key:"PopFromOutputStream",value:function(t){this.outputStream.splice(this.outputStream.length-t,t),this.OutputStreamDirty();}},{key:"TrySplittingHeadTailWhitespace",value:function(t){var e=t.value;if(null===e)return L("single.value");for(var n=-1,r=-1,i=0;i<e.length;i++){var a=e[i];if("\n"!=a){if(" "==a||"\t"==a)continue;break}-1==n&&(n=i),r=i;}for(var o=-1,s=-1,l=e.length-1;l>=0;l--){var u=e[l];if("\n"!=u){if(" "==u||"\t"==u)continue;break}-1==o&&(o=l),s=l;}if(-1==n&&-1==o)return null;var c=[],h=0,f=e.length;if(-1!=n){if(n>0){var d=new $(e.substring(0,n));c.push(d);}c.push(new $("\n")),h=r+1;}if(-1!=o&&(f=s),f>h){var v=e.substring(h,f-h);c.push(new $(v));}if(-1!=o&&s>r&&(c.push(new $("\n")),o<e.length-1)){var p=e.length-o-1,m=new $(e.substring(o+1,p));c.push(m);}return c}},{key:"PushToOutputStreamIndividual",value:function(t){var e=_(t,ne),n=_(t,$),r=!0;if(e)this.TrimNewlinesFromOutputStream(),r=!0;else if(n){var i=-1,a=this.callStack.currentElement;a.type==ct.Function&&(i=a.functionStartInOutputStream);for(var o=-1,s=this.outputStream.length-1;s>=0;s--){var l=this.outputStream[s],u=l instanceof et?l:null;if(null!=(l instanceof ne?l:null)){o=s;break}if(null!=u&&u.commandType==et.CommandType.BeginString){s>=i&&(i=-1);break}}if(-1!=(-1!=o&&-1!=i?Math.min(i,o):-1!=o?o:i)){if(n.isNewline)r=!1;else if(n.isNonWhitespace&&(o>-1&&this.RemoveExistingGlue(),i>-1))for(var c=this.callStack.elements,h=c.length-1;h>=0;h--){var f=c[h];if(f.type!=ct.Function)break;f.functionStartInOutputStream=-1;}}else n.isNewline&&(!this.outputStreamEndsInNewline&&this.outputStreamContainsContent||(r=!1));}if(r){if(null===t)return L("obj");this.outputStream.push(t),this.OutputStreamDirty();}}},{key:"TrimNewlinesFromOutputStream",value:function(){for(var t=-1,e=this.outputStream.length-1;e>=0;){var n=this.outputStream[e],r=_(n,et),i=_(n,$);if(null!=r||null!=i&&i.isNonWhitespace)break;null!=i&&i.isNewline&&(t=e),e--;}if(t>=0)for(e=t;e<this.outputStream.length;){_(this.outputStream[e],$)?this.outputStream.splice(e,1):e++;}this.OutputStreamDirty();}},{key:"RemoveExistingGlue",value:function(){for(var t=this.outputStream.length-1;t>=0;t--){var e=this.outputStream[t];if(e instanceof ne)this.outputStream.splice(t,1);else if(e instanceof et)break}this.OutputStreamDirty();}},{key:"outputStreamEndsInNewline",get:function(){if(this.outputStream.length>0)for(var t=this.outputStream.length-1;t>=0;t--){if(this.outputStream[t]instanceof et)break;var e=this.outputStream[t];if(e instanceof $){if(e.isNewline)return !0;if(e.isNonWhitespace)break}}return !1}},{key:"outputStreamContainsContent",get:function(){var t,e=S(this.outputStream);try{for(e.s();!(t=e.n()).done;){if(t.value instanceof $)return !0}}catch(t){e.e(t);}finally{e.f();}return !1}},{key:"inStringEvaluation",get:function(){for(var t=this.outputStream.length-1;t>=0;t--){var e=_(this.outputStream[t],et);if(e instanceof et&&e.commandType==et.CommandType.BeginString)return !0}return !1}},{key:"PushEvaluationStack",value:function(t){var e=_(t,Z);if(e){var n=e.value;if(null===n)return L("rawList");if(null!=n.originNames){n.origins||(n.origins=[]),n.origins.length=0;var r,i=S(n.originNames);try{for(i.s();!(r=i.n()).done;){var a=r.value;if(null===this.story.listDefinitions)return L("StoryState.story.listDefinitions");var o=this.story.listDefinitions.TryListGetDefinition(a,null);if(null===o.result)return L("StoryState def.result");n.origins.indexOf(o.result)<0&&n.origins.push(o.result);}}catch(t){i.e(t);}finally{i.f();}}}if(null===t)return L("obj");this.evaluationStack.push(t);}},{key:"PopEvaluationStack",value:function(t){if(void 0===t)return P(this.evaluationStack.pop());if(t>this.evaluationStack.length)throw new Error("trying to pop too many objects");return P(this.evaluationStack.splice(this.evaluationStack.length-t,t))}},{key:"PeekEvaluationStack",value:function(){return this.evaluationStack[this.evaluationStack.length-1]}},{key:"ForceEnd",value:function(){this.callStack.Reset(),this._currentFlow.currentChoices.length=0,this.currentPointer=dt.Null,this.previousPointer=dt.Null,this.didSafeExit=!0;}},{key:"TrimWhitespaceFromFunctionEnd",value:function(){I.Assert(this.callStack.currentElement.type==ct.Function);var t=this.callStack.currentElement.functionStartInOutputStream;-1==t&&(t=0);for(var e=this.outputStream.length-1;e>=t;e--){var n=this.outputStream[e],r=_(n,$),i=_(n,et);if(null!=r){if(i)break;if(!r.isNewline&&!r.isInlineWhitespace)break;this.outputStream.splice(e,1),this.OutputStreamDirty();}}}},{key:"PopCallStack",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;this.callStack.currentElement.type==ct.Function&&this.TrimWhitespaceFromFunctionEnd(),this.callStack.Pop(t);}},{key:"SetChosenPath",value:function(t,e){this._currentFlow.currentChoices.length=0;var n=this.story.PointerAtPath(t);n.isNull||-1!=n.index||(n.index=0),this.currentPointer=n,e&&this.currentTurnIndex++;}},{key:"StartFunctionEvaluationFromGame",value:function(t,e){this.callStack.Push(ct.FunctionEvaluationFromGame,this.evaluationStack.length),this.callStack.currentElement.currentPointer=dt.StartOf(t),this.PassArgumentsToEvaluationStack(e);}},{key:"PassArgumentsToEvaluationStack",value:function(t){if(null!==t)for(var e=0;e<t.length;e++){if("number"!=typeof t[e]&&"string"!=typeof t[e]||t[e]instanceof B)throw new Error(("null"));this.PushEvaluationStack(K.Create(t[e]));}}},{key:"TryExitFunctionEvaluationFromGame",value:function(){return this.callStack.currentElement.type==ct.FunctionEvaluationFromGame&&(this.currentPointer=dt.Null,this.didSafeExit=!0,!0)}},{key:"CompleteFunctionEvaluationFromGame",value:function(){if(this.callStack.currentElement.type!=ct.FunctionEvaluationFromGame)throw new Error("Expected external function evaluation to be complete. Stack trace: "+this.callStack.callStackTrace);for(var t=this.callStack.currentElement.evaluationStackHeightWhenPushed,e=null;this.evaluationStack.length>t;){var n=this.PopEvaluationStack();null===e&&(e=n);}if(this.PopCallStack(ct.FunctionEvaluationFromGame),e){if(e instanceof rt)return null;var r=A(e,K);return r.valueType==U.DivertTarget?r.valueObject.toString():r.valueObject}return null}},{key:"AddError",value:function(t,e){e?(null==this._currentWarnings&&(this._currentWarnings=[]),this._currentWarnings.push(t)):(null==this._currentErrors&&(this._currentErrors=[]),this._currentErrors.push(t));}},{key:"OutputStreamDirty",value:function(){this._outputStreamTextDirty=!0,this._outputStreamTagsDirty=!0;}}]),e}(),we=function(){function t(){n(this,t),this.startTime=void 0;}return i(t,[{key:"ElapsedMilliseconds",get:function(){return void 0===this.startTime?0:(new Date).getTime()-this.startTime}},{key:"Start",value:function(){this.startTime=(new Date).getTime();}},{key:"Stop",value:function(){this.startTime=void 0;}}]),t}();!function(t){t[t.Author=0]="Author",t[t.Warning=1]="Warning",t[t.Error=2]="Error";}(Ce||(Ce={})),Number.isInteger||(Number.isInteger=function(t){return "number"==typeof t&&isFinite(t)&&t>-9007199254740992&&t<9007199254740992&&Math.floor(t)===t}),t.Story=function(t){a(o,t);var r=d(o);function o(){var t,e;n(this,o),(t=r.call(this)).inkVersionMinimumCompatible=18,t.onError=null,t.onDidContinue=null,t.onMakeChoice=null,t.onEvaluateFunction=null,t.onCompleteEvaluateFunction=null,t.onChoosePathString=null,t._prevContainers=[],t.allowExternalFunctionFallbacks=!1,t._listDefinitions=null,t._variableObservers=null,t._hasValidatedExternals=!1,t._temporaryEvaluationContainer=null,t._asyncContinueActive=!1,t._stateSnapshotAtLastNewline=null,t._sawLookaheadUnsafeFunctionAfterNewline=!1,t._recursiveContinueCount=0,t._asyncSaving=!1,t._profiler=null;var i=null,a=null;if(arguments[0]instanceof tt)e=arguments[0],void 0!==arguments[1]&&(i=arguments[1]),t._mainContentContainer=e;else if("string"==typeof arguments[0]){var s=arguments[0];a=ge.TextToDictionary(s);}else a=arguments[0];if(null!=i&&(t._listDefinitions=new fe(i)),t._externals=new Map,null!==a){var l=a,u=l.inkVersion;if(null==u)throw new Error("ink version number not found. Are you sure it's a valid .ink.json file?");var c=parseInt(u);if(c>o.inkVersionCurrent)throw new Error("Version of ink used to build story was newer than the current version of the engine");if(c<t.inkVersionMinimumCompatible)throw new Error("Version of ink used to build story is too old to be loaded by this version of the engine");c!=o.inkVersionCurrent&&console.warn("WARNING: Version of ink used to build story doesn't match current version of engine. Non-critical, but recommend synchronising.");var h,f=l.root;if(null==f)throw new Error("Root node for ink not found. Are you sure it's a valid .ink.json file?");(h=l.listDefs)&&(t._listDefinitions=de.JTokenToListDefinitions(h)),t._mainContentContainer=A(de.JTokenToRuntimeObject(f),tt),t.ResetState();}return t}return i(o,[{key:"currentChoices",get:function(){var t=[];if(null===this._state)return L("this._state");var e,n=S(this._state.currentChoices);try{for(n.s();!(e=n.n()).done;){var r=e.value;r.isInvisibleDefault||(r.index=t.length,t.push(r));}}catch(t){n.e(t);}finally{n.f();}return t}},{key:"currentText",get:function(){return this.IfAsyncWeCant("call currentText since it's a work in progress"),this.state.currentText}},{key:"currentTags",get:function(){return this.IfAsyncWeCant("call currentTags since it's a work in progress"),this.state.currentTags}},{key:"currentErrors",get:function(){return this.state.currentErrors}},{key:"currentWarnings",get:function(){return this.state.currentWarnings}},{key:"currentFlowName",get:function(){return this.state.currentFlowName}},{key:"hasError",get:function(){return this.state.hasError}},{key:"hasWarning",get:function(){return this.state.hasWarning}},{key:"variablesState",get:function(){return this.state.variablesState}},{key:"listDefinitions",get:function(){return this._listDefinitions}},{key:"state",get:function(){return this._state}},{key:"StartProfiling",value:function(){}},{key:"EndProfiling",value:function(){}},{key:"ToJson",value:function(t){var e=this,n=!1;if(t||(n=!0,t=new ge.Writer),t.WriteObjectStart(),t.WriteIntProperty("inkVersion",o.inkVersionCurrent),t.WriteProperty("root",(function(t){return de.WriteRuntimeContainer(t,e._mainContentContainer)})),null!=this._listDefinitions){t.WritePropertyStart("listDefs"),t.WriteObjectStart();var r,i=S(this._listDefinitions.lists);try{for(i.s();!(r=i.n()).done;){var a=r.value;t.WritePropertyStart(a.name),t.WriteObjectStart();var s,l=S(a.items);try{for(l.s();!(s=l.n()).done;){var u=m(s.value,2),c=u[0],h=u[1],f=M.fromSerializedKey(c),d=h;t.WriteIntProperty(f.itemName,d);}}catch(t){l.e(t);}finally{l.f();}t.WriteObjectEnd(),t.WritePropertyEnd();}}catch(t){i.e(t);}finally{i.f();}t.WriteObjectEnd(),t.WritePropertyEnd();}if(t.WriteObjectEnd(),n)return t.toString()}},{key:"ResetState",value:function(){this.IfAsyncWeCant("ResetState"),this._state=new be(this),this._state.variablesState.ObserveVariableChange(this.VariableStateDidChangeEvent.bind(this)),this.ResetGlobals();}},{key:"ResetErrors",value:function(){if(null===this._state)return L("this._state");this._state.ResetErrors();}},{key:"ResetCallstack",value:function(){if(this.IfAsyncWeCant("ResetCallstack"),null===this._state)return L("this._state");this._state.ForceEnd();}},{key:"ResetGlobals",value:function(){if(this._mainContentContainer.namedContent.get("global decl")){var t=this.state.currentPointer.copy();this.ChoosePath(new R("global decl"),!1),this.ContinueInternal(),this.state.currentPointer=t;}this.state.variablesState.SnapshotDefaultGlobals();}},{key:"SwitchFlow",value:function(t){if(this.IfAsyncWeCant("switch flow"),this._asyncSaving)throw new Error("Story is already in background saving mode, can't switch flow to "+t);this.state.SwitchFlow_Internal(t);}},{key:"RemoveFlow",value:function(t){this.state.RemoveFlow_Internal(t);}},{key:"SwitchToDefaultFlow",value:function(){this.state.SwitchToDefaultFlow_Internal();}},{key:"Continue",value:function(){return this.ContinueAsync(0),this.currentText}},{key:"canContinue",get:function(){return this.state.canContinue}},{key:"asyncContinueComplete",get:function(){return !this._asyncContinueActive}},{key:"ContinueAsync",value:function(t){this._hasValidatedExternals||this.ValidateExternalBindings(),this.ContinueInternal(t);}},{key:"ContinueInternal",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;null!=this._profiler&&this._profiler.PreContinue();var e=t>0;if(this._recursiveContinueCount++,!this._asyncContinueActive){if(this._asyncContinueActive=e,!this.canContinue)throw new Error("Can't continue - should check canContinue before calling Continue");this._state.didSafeExit=!1,this._state.ResetOutput(),1==this._recursiveContinueCount&&(this._state.variablesState.batchObservingVariableChanges=!0);}var n=new we;n.Start();var r=!1;this._sawLookaheadUnsafeFunctionAfterNewline=!1;do{try{r=this.ContinueSingleStep();}catch(t){if(!(t instanceof G))throw t;this.AddError(t.message,void 0,t.useEndLineNumber);break}if(r)break;if(this._asyncContinueActive&&n.ElapsedMilliseconds>t)break}while(this.canContinue);if(n.Stop(),!r&&this.canContinue||(null!==this._stateSnapshotAtLastNewline&&this.RestoreStateSnapshot(),this.canContinue||(this.state.callStack.canPopThread&&this.AddError("Thread available to pop, threads should always be flat by the end of evaluation?"),0!=this.state.generatedChoices.length||this.state.didSafeExit||null!=this._temporaryEvaluationContainer||(this.state.callStack.CanPop(ct.Tunnel)?this.AddError("unexpectedly reached end of content. Do you need a '->->' to return from a tunnel?"):this.state.callStack.CanPop(ct.Function)?this.AddError("unexpectedly reached end of content. Do you need a '~ return'?"):this.state.callStack.canPop?this.AddError("unexpectedly reached end of content for unknown reason. Please debug compiler!"):this.AddError("ran out of content. Do you need a '-> DONE' or '-> END'?"))),this.state.didSafeExit=!1,this._sawLookaheadUnsafeFunctionAfterNewline=!1,1==this._recursiveContinueCount&&(this._state.variablesState.batchObservingVariableChanges=!1),this._asyncContinueActive=!1,null!==this.onDidContinue&&this.onDidContinue()),this._recursiveContinueCount--,null!=this._profiler&&this._profiler.PostContinue(),this.state.hasError||this.state.hasWarning){if(null===this.onError){var i=new j;throw i.Append("Ink had "),this.state.hasError&&(i.Append("".concat(this.state.currentErrors.length)),i.Append(1==this.state.currentErrors.length?" error":"errors"),this.state.hasWarning&&i.Append(" and ")),this.state.hasWarning&&(i.Append("".concat(this.state.currentWarnings.length)),i.Append(1==this.state.currentWarnings.length?" warning":"warnings"),this.state.hasWarning&&i.Append(" and ")),i.Append(". It is strongly suggested that you assign an error handler to story.onError. The first issue was: "),i.Append(this.state.hasError?this.state.currentErrors[0]:this.state.currentWarnings[0]),new G(i.toString())}if(this.state.hasError){var a,o=S(this.state.currentErrors);try{for(o.s();!(a=o.n()).done;){var s=a.value;this.onError(s,Ce.Error);}}catch(s){o.e(s);}finally{o.f();}}if(this.state.hasWarning){var l,u=S(this.state.currentWarnings);try{for(u.s();!(l=u.n()).done;){var c=l.value;this.onError(c,Ce.Warning);}}catch(s){u.e(s);}finally{u.f();}}this.ResetErrors();}}},{key:"ContinueSingleStep",value:function(){if(null!=this._profiler&&this._profiler.PreStep(),this.Step(),null!=this._profiler&&this._profiler.PostStep(),this.canContinue||this.state.callStack.elementIsEvaluateFromGame||this.TryFollowDefaultInvisibleChoice(),null!=this._profiler&&this._profiler.PreSnapshot(),!this.state.inStringEvaluation){if(null!==this._stateSnapshotAtLastNewline){if(null===this._stateSnapshotAtLastNewline.currentTags)return L("this._stateAtLastNewline.currentTags");if(null===this.state.currentTags)return L("this.state.currentTags");var t=this.CalculateNewlineOutputStateChange(this._stateSnapshotAtLastNewline.currentText,this.state.currentText,this._stateSnapshotAtLastNewline.currentTags.length,this.state.currentTags.length);if(t==o.OutputStateChange.ExtendedBeyondNewline||this._sawLookaheadUnsafeFunctionAfterNewline)return this.RestoreStateSnapshot(),!0;t==o.OutputStateChange.NewlineRemoved&&this.DiscardSnapshot();}this.state.outputStreamEndsInNewline&&(this.canContinue?null==this._stateSnapshotAtLastNewline&&this.StateSnapshot():this.DiscardSnapshot());}return null!=this._profiler&&this._profiler.PostSnapshot(),!1}},{key:"CalculateNewlineOutputStateChange",value:function(t,e,n,r){if(null===t)return L("prevText");if(null===e)return L("currText");var i=e.length>=t.length&&"\n"==e.charAt(t.length-1);if(n==r&&t.length==e.length&&i)return o.OutputStateChange.NoChange;if(!i)return o.OutputStateChange.NewlineRemoved;if(r>n)return o.OutputStateChange.ExtendedBeyondNewline;for(var a=t.length;a<e.length;a++){var s=e.charAt(a);if(" "!=s&&"\t"!=s)return o.OutputStateChange.ExtendedBeyondNewline}return o.OutputStateChange.NoChange}},{key:"ContinueMaximally",value:function(){this.IfAsyncWeCant("ContinueMaximally");for(var t=new j;this.canContinue;)t.Append(this.Continue());return t.toString()}},{key:"ContentAtPath",value:function(t){return this.mainContentContainer.ContentAtPath(t)}},{key:"KnotContainerWithName",value:function(t){var e=this.mainContentContainer.namedContent.get(t);return e instanceof tt?e:null}},{key:"PointerAtPath",value:function(t){if(0==t.length)return dt.Null;var e=new dt,n=t.length,r=null;return null===t.lastComponent?L("path.lastComponent"):(t.lastComponent.isIndex?(n=t.length-1,r=this.mainContentContainer.ContentAtPath(t,void 0,n),e.container=r.container,e.index=t.lastComponent.index):(r=this.mainContentContainer.ContentAtPath(t),e.container=r.container,e.index=-1),null==r.obj||r.obj==this.mainContentContainer&&n>0?this.Error("Failed to find content at path '"+t+"', and no approximation of it was possible."):r.approximate&&this.Warning("Failed to find content at path '"+t+"', so it was approximated to: '"+r.obj.path+"'."),e)}},{key:"StateSnapshot",value:function(){this._stateSnapshotAtLastNewline=this._state,this._state=this._state.CopyAndStartPatching();}},{key:"RestoreStateSnapshot",value:function(){null===this._stateSnapshotAtLastNewline&&L("_stateSnapshotAtLastNewline"),this._stateSnapshotAtLastNewline.RestoreAfterPatch(),this._state=this._stateSnapshotAtLastNewline,this._stateSnapshotAtLastNewline=null,this._asyncSaving||this._state.ApplyAnyPatch();}},{key:"DiscardSnapshot",value:function(){this._asyncSaving||this._state.ApplyAnyPatch(),this._stateSnapshotAtLastNewline=null;}},{key:"CopyStateForBackgroundThreadSave",value:function(){if(this.IfAsyncWeCant("start saving on a background thread"),this._asyncSaving)throw new Error("Story is already in background saving mode, can't call CopyStateForBackgroundThreadSave again!");var t=this._state;return this._state=this._state.CopyAndStartPatching(),this._asyncSaving=!0,t}},{key:"BackgroundSaveComplete",value:function(){null===this._stateSnapshotAtLastNewline&&this._state.ApplyAnyPatch(),this._asyncSaving=!1;}},{key:"Step",value:function(){var t=!0,e=this.state.currentPointer.copy();if(!e.isNull){for(var n=_(e.Resolve(),tt);n&&(this.VisitContainer(n,!0),0!=n.content.length);)n=_((e=dt.StartOf(n)).Resolve(),tt);this.state.currentPointer=e.copy(),null!=this._profiler&&this._profiler.Step(this.state.callStack);var r=e.Resolve(),i=this.PerformLogicAndFlowControl(r);if(!this.state.currentPointer.isNull){i&&(t=!1);var a=_(r,ht);if(a){var o=this.ProcessChoice(a);o&&this.state.generatedChoices.push(o),r=null,t=!1;}if(r instanceof tt&&(t=!1),t){var s=_(r,Y);if(s&&-1==s.contextIndex){var l=this.state.callStack.ContextForVariableNamed(s.variableName);r=new Y(s.variableName,l);}this.state.inExpressionEvaluation?this.state.PushEvaluationStack(r):this.state.PushToOutputStream(r);}this.NextContent();var u=_(r,et);u&&u.commandType==et.CommandType.StartThread&&this.state.callStack.PushThread();}}}},{key:"VisitContainer",value:function(t,e){t.countingAtStartOnly&&!e||(t.visitsShouldBeCounted&&this.state.IncrementVisitCountForContainer(t),t.turnIndexShouldBeCounted&&this.state.RecordTurnIndexVisitToContainer(t));}},{key:"VisitChangedContainersDueToDivert",value:function(){var t=this.state.previousPointer.copy(),e=this.state.currentPointer.copy();if(!e.isNull&&-1!=e.index){if(this._prevContainers.length=0,!t.isNull)for(var n=_(t.Resolve(),tt)||_(t.container,tt);n;)this._prevContainers.push(n),n=_(n.parent,tt);var r=e.Resolve();if(null!=r)for(var i=_(r.parent,tt),a=!0;i&&(this._prevContainers.indexOf(i)<0||i.countingAtStartOnly);){var o=i.content.length>0&&r==i.content[0]&&a;o||(a=!1),this.VisitContainer(i,o),r=i,i=_(i.parent,tt);}}}},{key:"ProcessChoice",value:function(t){var e=!0;if(t.hasCondition){var n=this.state.PopEvaluationStack();this.IsTruthy(n)||(e=!1);}var r="",i="";t.hasChoiceOnlyContent&&(i=A(this.state.PopEvaluationStack(),$).value||"");t.hasStartContent&&(r=A(this.state.PopEvaluationStack(),$).value||"");t.onceOnly&&(this.state.VisitCountForContainer(t.choiceTarget)>0&&(e=!1));if(!e)return null;var a=new he;return a.targetPath=t.pathOnChoice,a.sourcePath=t.path.toString(),a.isInvisibleDefault=t.isInvisibleDefault,a.threadAtGeneration=this.state.callStack.ForkThread(),a.text=(r+i).replace(/^[ \t]+|[ \t]+$/g,""),a}},{key:"IsTruthy",value:function(t){if(t instanceof K){var e=t;if(e instanceof X){var n=e;return this.Error("Shouldn't use a divert target (to "+n.targetPath+") as a conditional value. Did you intend a function call 'likeThis()' or a read count check 'likeThis'? (no arrows)"),!1}return e.isTruthy}return !1}},{key:"PerformLogicAndFlowControl",value:function(t){if(null==t)return !1;if(t instanceof vt){var e=t;if(e.isConditional){var n=this.state.PopEvaluationStack();if(!this.IsTruthy(n))return !0}if(e.hasVariableTarget){var r=e.variableDivertName,i=this.state.variablesState.GetVariableWithName(r);if(null==i)this.Error("Tried to divert using a target from a variable that could not be found ("+r+")");else if(!(i instanceof X)){var a=_(i,J),o="Tried to divert to a target from a variable, but the variable ("+r+") didn't contain a divert target, it ";a instanceof J&&0==a.value?o+="was empty/null (the value 0).":o+="contained '"+i+"'.",this.Error(o);}var s=A(i,X);this.state.divertedPointer=this.PointerAtPath(s.targetPath);}else {if(e.isExternal)return this.CallExternalFunction(e.targetPathString,e.externalArgs),!0;this.state.divertedPointer=e.targetPointer.copy();}return e.pushesToStack&&this.state.callStack.Push(e.stackPushType,void 0,this.state.outputStream.length),this.state.divertedPointer.isNull&&!e.isExternal&&(e&&e.debugMetadata&&null!=e.debugMetadata.sourceName?this.Error("Divert target doesn't exist: "+e.debugMetadata.sourceName):this.Error("Divert resolution failed: "+e)),!0}if(t instanceof et){var l=t;switch(l.commandType){case et.CommandType.EvalStart:this.Assert(!1===this.state.inExpressionEvaluation,"Already in expression evaluation?"),this.state.inExpressionEvaluation=!0;break;case et.CommandType.EvalEnd:this.Assert(!0===this.state.inExpressionEvaluation,"Not in expression evaluation mode"),this.state.inExpressionEvaluation=!1;break;case et.CommandType.EvalOutput:if(this.state.evaluationStack.length>0){var u=this.state.PopEvaluationStack();if(!(u instanceof rt)){var c=new $(u.toString());this.state.PushToOutputStream(c);}}break;case et.CommandType.NoOp:break;case et.CommandType.Duplicate:this.state.PushEvaluationStack(this.state.PeekEvaluationStack());break;case et.CommandType.PopEvaluatedValue:this.state.PopEvaluationStack();break;case et.CommandType.PopFunction:case et.CommandType.PopTunnel:var h=l.commandType==et.CommandType.PopFunction?ct.Function:ct.Tunnel,f=null;if(h==ct.Tunnel){var d=this.state.PopEvaluationStack();null===(f=_(d,X))&&this.Assert(d instanceof rt,"Expected void if ->-> doesn't override target");}if(this.state.TryExitFunctionEvaluationFromGame())break;if(this.state.callStack.currentElement.type==h&&this.state.callStack.canPop)this.state.PopCallStack(),f&&(this.state.divertedPointer=this.PointerAtPath(f.targetPath));else {var v=new Map;v.set(ct.Function,"function return statement (~ return)"),v.set(ct.Tunnel,"tunnel onwards statement (->->)");var p=v.get(this.state.callStack.currentElement.type);this.state.callStack.canPop||(p="end of flow (-> END or choice)");var m="Found "+v.get(h)+", when expected "+p;this.Error(m);}break;case et.CommandType.BeginString:this.state.PushToOutputStream(l),this.Assert(!0===this.state.inExpressionEvaluation,"Expected to be in an expression when evaluating a string"),this.state.inExpressionEvaluation=!1;break;case et.CommandType.EndString:for(var y=[],g=0,C=this.state.outputStream.length-1;C>=0;--C){var b=this.state.outputStream[C];g++;var w=_(b,et);if(w&&w.commandType==et.CommandType.BeginString)break;b instanceof $&&y.push(b);}this.state.PopFromOutputStream(g),y=y.reverse();var k,E=new j,T=S(y);try{for(T.s();!(k=T.n()).done;){var P=k.value;E.Append(P.toString());}}catch(t){T.e(t);}finally{T.f();}this.state.inExpressionEvaluation=!0,this.state.PushEvaluationStack(new $(E.toString()));break;case et.CommandType.ChoiceCount:var x=this.state.generatedChoices.length;this.state.PushEvaluationStack(new J(x));break;case et.CommandType.Turns:this.state.PushEvaluationStack(new J(this.state.currentTurnIndex+1));break;case et.CommandType.TurnsSince:case et.CommandType.ReadCount:var N=this.state.PopEvaluationStack();if(!(N instanceof X)){var O="";N instanceof J&&(O=". Did you accidentally pass a read count ('knot_name') instead of a target ('-> knot_name')?"),this.Error("TURNS_SINCE / READ_COUNT expected a divert target (knot, stitch, label name), but saw "+N+O);break}var I,W=A(N,X),F=_(this.ContentAtPath(W.targetPath).correctObj,tt);null!=F?I=l.commandType==et.CommandType.TurnsSince?this.state.TurnsSinceForContainer(F):this.state.VisitCountForContainer(F):(I=l.commandType==et.CommandType.TurnsSince?-1:0,this.Warning("Failed to find container for "+l.toString()+" lookup at "+W.targetPath.toString())),this.state.PushEvaluationStack(new J(I));break;case et.CommandType.Random:var R=_(this.state.PopEvaluationStack(),J),D=_(this.state.PopEvaluationStack(),J);if(null==D||D instanceof J==!1)return this.Error("Invalid value for minimum parameter of RANDOM(min, max)");if(null==R||D instanceof J==!1)return this.Error("Invalid value for maximum parameter of RANDOM(min, max)");if(null===R.value)return L("maxInt.value");if(null===D.value)return L("minInt.value");var V=R.value-D.value+1;(!isFinite(V)||V>Number.MAX_SAFE_INTEGER)&&(V=Number.MAX_SAFE_INTEGER,this.Error("RANDOM was called with a range that exceeds the size that ink numbers can use.")),V<=0&&this.Error("RANDOM was called with minimum as "+D.value+" and maximum as "+R.value+". The maximum must be larger");var q=this.state.storySeed+this.state.previousRandom,U=new me(q).next(),H=U%V+D.value;this.state.PushEvaluationStack(new J(H)),this.state.previousRandom=U;break;case et.CommandType.SeedRandom:var z=_(this.state.PopEvaluationStack(),J);if(null==z||z instanceof J==!1)return this.Error("Invalid value passed to SEED_RANDOM");if(null===z.value)return L("minInt.value");this.state.storySeed=z.value,this.state.previousRandom=0,this.state.PushEvaluationStack(new rt);break;case et.CommandType.VisitIndex:var Y=this.state.VisitCountForContainer(this.state.currentPointer.container)-1;this.state.PushEvaluationStack(new J(Y));break;case et.CommandType.SequenceShuffleIndex:var Q=this.NextSequenceShuffleIndex();this.state.PushEvaluationStack(new J(Q));break;case et.CommandType.StartThread:break;case et.CommandType.Done:this.state.callStack.canPopThread?this.state.callStack.PopThread():(this.state.didSafeExit=!0,this.state.currentPointer=dt.Null);break;case et.CommandType.End:this.state.ForceEnd();break;case et.CommandType.ListFromInt:var nt=_(this.state.PopEvaluationStack(),J),at=A(this.state.PopEvaluationStack(),$);if(null===nt)throw new G("Passed non-integer when creating a list element from a numerical value.");var ot=null;if(null===this.listDefinitions)return L("this.listDefinitions");var st=this.listDefinitions.TryListGetDefinition(at.value,null);if(!st.exists)throw new G("Failed to find LIST called "+at.value);if(null===nt.value)return L("minInt.value");var lt=st.result.TryGetItemWithValue(nt.value,M.Null);lt.exists&&(ot=new Z(lt.result,nt.value)),null==ot&&(ot=new Z),this.state.PushEvaluationStack(ot);break;case et.CommandType.ListRange:var ut=_(this.state.PopEvaluationStack(),K),ht=_(this.state.PopEvaluationStack(),K),ft=_(this.state.PopEvaluationStack(),Z);if(null===ft||null===ht||null===ut)throw new G("Expected list, minimum and maximum for LIST_RANGE");if(null===ft.value)return L("targetList.value");var mt=ft.value.ListWithSubRange(ht.valueObject,ut.valueObject);this.state.PushEvaluationStack(new Z(mt));break;case et.CommandType.ListRandom:var yt=this.state.PopEvaluationStack();if(null===yt)throw new G("Expected list for LIST_RANDOM");var gt=yt.value,Ct=null;if(null===gt)throw L("list");if(0==gt.Count)Ct=new B;else {for(var St=this.state.storySeed+this.state.previousRandom,bt=new me(St).next(),wt=bt%gt.Count,kt=gt.entries(),Et=0;Et<=wt-1;Et++)kt.next();var _t=kt.next().value,At={Key:M.fromSerializedKey(_t[0]),Value:_t[1]};if(null===At.Key.originName)return L("randomItem.Key.originName");(Ct=new B(At.Key.originName,this)).Add(At.Key,At.Value),this.state.previousRandom=bt;}this.state.PushEvaluationStack(new Z(Ct));break;default:this.Error("unhandled ControlCommand: "+l);}return !0}if(t instanceof pt){var Tt=t,Pt=this.state.PopEvaluationStack();return this.state.variablesState.Assign(Tt,Pt),!0}if(t instanceof Wt){var xt=t,Nt=null;if(null!=xt.pathForCount){var Ot=xt.containerForCount,It=this.state.VisitCountForContainer(Ot);Nt=new J(It);}else null==(Nt=this.state.variablesState.GetVariableWithName(xt.name))&&(this.Warning("Variable not found: '"+xt.name+"'. Using default value of 0 (false). This can happen with temporary variables if the declaration hasn't yet been hit. Globals are always given a default value on load if a value doesn't exist in the save state."),Nt=new J(0));return this.state.PushEvaluationStack(Nt),!0}if(t instanceof it){var Ft=t,Rt=this.state.PopEvaluationStack(Ft.numberOfParameters),Dt=Ft.Call(Rt);return this.state.PushEvaluationStack(Dt),!0}return !1}},{key:"ChoosePathString",value:function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];if(this.IfAsyncWeCant("call ChoosePathString right now"),null!==this.onChoosePathString&&this.onChoosePathString(t,n),e)this.ResetCallstack();else if(this.state.callStack.currentElement.type==ct.Function){var r="",i=this.state.callStack.currentElement.currentPointer.container;throw null!=i&&(r="("+i.path.toString()+") "),new Error("Story was running a function "+r+"when you called ChoosePathString("+t+") - this is almost certainly not not what you want! Full stack trace: \n"+this.state.callStack.callStackTrace)}this.state.PassArgumentsToEvaluationStack(n),this.ChoosePath(new R(t));}},{key:"IfAsyncWeCant",value:function(t){if(this._asyncContinueActive)throw new Error("Can't "+t+". Story is in the middle of a ContinueAsync(). Make more ContinueAsync() calls or a single Continue() call beforehand.")}},{key:"ChoosePath",value:function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];this.state.SetChosenPath(t,e),this.VisitChangedContainersDueToDivert();}},{key:"ChooseChoiceIndex",value:function(t){t=t;var e=this.currentChoices;this.Assert(t>=0&&t<e.length,"choice out of range");var n=e[t];return null!==this.onMakeChoice&&this.onMakeChoice(n),null===n.threadAtGeneration?L("choiceToChoose.threadAtGeneration"):null===n.targetPath?L("choiceToChoose.targetPath"):(this.state.callStack.currentThread=n.threadAtGeneration,void this.ChoosePath(n.targetPath))}},{key:"HasFunction",value:function(t){try{return null!=this.KnotContainerWithName(t)}catch(t){return !1}}},{key:"EvaluateFunction",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(null!==this.onEvaluateFunction&&this.onEvaluateFunction(t,e),this.IfAsyncWeCant("evaluate a function"),null==t)throw new Error("Function is null");if(""==t||""==t.trim())throw new Error("Function is empty or white space.");var r=this.KnotContainerWithName(t);if(null==r)throw new Error("Function doesn't exist: '"+t+"'");var i=[];i.push.apply(i,y(this.state.outputStream)),this._state.ResetOutput(),this.state.StartFunctionEvaluationFromGame(r,e);for(var a=new j;this.canContinue;)a.Append(this.Continue());var o=a.toString();this._state.ResetOutput(i);var s=this.state.CompleteFunctionEvaluationFromGame();return null!=this.onCompleteEvaluateFunction&&this.onCompleteEvaluateFunction(t,e,o,s),n?{returned:s,output:o}:s}},{key:"EvaluateExpression",value:function(t){var e=this.state.callStack.elements.length;this.state.callStack.Push(ct.Tunnel),this._temporaryEvaluationContainer=t,this.state.GoToStart();var n=this.state.evaluationStack.length;return this.Continue(),this._temporaryEvaluationContainer=null,this.state.callStack.elements.length>e&&this.state.PopCallStack(),this.state.evaluationStack.length>n?this.state.PopEvaluationStack():null}},{key:"CallExternalFunction",value:function(t,n){if(null===t)return L("funcName");var r=this._externals.get(t),i=null,a=void 0!==r;if(!a||r.lookAheadSafe||null===this._stateSnapshotAtLastNewline){if(!a){if(this.allowExternalFunctionFallbacks)return i=this.KnotContainerWithName(t),this.Assert(null!==i,"Trying to call EXTERNAL function '"+t+"' which has not been bound, and fallback ink function could not be found."),this.state.callStack.Push(ct.Function,void 0,this.state.outputStream.length),void(this.state.divertedPointer=dt.StartOf(i));this.Assert(!1,"Trying to call EXTERNAL function '"+t+"' which has not been bound (and ink fallbacks disabled).");}for(var o=[],s=0;s<n;++s){var l=A(this.state.PopEvaluationStack(),K).valueObject;o.push(l);}o.reverse();var u=r.function(o),c=null;null!=u?(c=K.Create(u),this.Assert(null!==c,"Could not create ink value from returned object of type "+e(u))):c=new rt,this.state.PushEvaluationStack(c);}else this._sawLookaheadUnsafeFunctionAfterNewline=!0;}},{key:"BindExternalFunctionGeneral",value:function(t,e,n){this.IfAsyncWeCant("bind an external function"),this.Assert(!this._externals.has(t),"Function '"+t+"' has already been bound."),this._externals.set(t,{function:e,lookAheadSafe:n});}},{key:"TryCoerce",value:function(t){return t}},{key:"BindExternalFunction",value:function(t,e,n){var r=this;this.Assert(null!=e,"Can't bind a null function"),this.BindExternalFunctionGeneral(t,(function(t){r.Assert(t.length>=e.length,"External function expected "+e.length+" arguments");for(var n=[],i=0,a=t.length;i<a;i++)n[i]=r.TryCoerce(t[i]);return e.apply(null,n)}),n);}},{key:"UnbindExternalFunction",value:function(t){this.IfAsyncWeCant("unbind an external a function"),this.Assert(this._externals.has(t),"Function '"+t+"' has not been bound."),this._externals.delete(t);}},{key:"ValidateExternalBindings",value:function(){var t=null,e=null,n=arguments[1]||new Set;if(arguments[0]instanceof tt&&(t=arguments[0]),arguments[0]instanceof V&&(e=arguments[0]),null===t&&null===e)if(this.ValidateExternalBindings(this._mainContentContainer,n),this._hasValidatedExternals=!0,0==n.size)this._hasValidatedExternals=!0;else {var r="Error: Missing function binding for external";r+=n.size>1?"s":"",r+=": '",r+=Array.from(n).join("', '"),r+="' ",r+=this.allowExternalFunctionFallbacks?", and no fallback ink function found.":" (ink fallbacks disabled)",this.Error(r);}else if(null!=t){var i,a=S(t.content);try{for(a.s();!(i=a.n()).done;){var o=i.value,s=o;null!=s&&s.hasValidName||this.ValidateExternalBindings(o,n);}}catch(t){a.e(t);}finally{a.f();}var l,u=S(t.namedContent);try{for(u.s();!(l=u.n()).done;){var c=m(l.value,2),h=c[1];this.ValidateExternalBindings(_(h,V),n);}}catch(t){u.e(t);}finally{u.f();}}else if(null!=e){var f=_(e,vt);if(f&&f.isExternal){var d=f.targetPathString;if(null===d)return L("name");if(!this._externals.has(d))if(this.allowExternalFunctionFallbacks){var v=this.mainContentContainer.namedContent.has(d);v||n.add(d);}else n.add(d);}}}},{key:"ObserveVariable",value:function(t,e){if(this.IfAsyncWeCant("observe a new variable"),null===this._variableObservers&&(this._variableObservers=new Map),!this.state.variablesState.GlobalVariableExistsWithName(t))throw new Error("Cannot observe variable '"+t+"' because it wasn't declared in the ink story.");this._variableObservers.has(t)?this._variableObservers.get(t).push(e):this._variableObservers.set(t,[e]);}},{key:"ObserveVariables",value:function(t,e){for(var n=0,r=t.length;n<r;n++)this.ObserveVariable(t[n],e[n]);}},{key:"RemoveVariableObserver",value:function(t,e){if(this.IfAsyncWeCant("remove a variable observer"),null!==this._variableObservers)if(null!=e){if(this._variableObservers.has(e))if(null!=t){var n=this._variableObservers.get(e);null!=n&&(n.splice(n.indexOf(t),1),0===n.length&&this._variableObservers.delete(e));}else this._variableObservers.delete(e);}else if(null!=t){var r,i=S(this._variableObservers.keys());try{for(i.s();!(r=i.n()).done;){var a=r.value,o=this._variableObservers.get(a);null!=o&&(o.splice(o.indexOf(t),1),0===o.length&&this._variableObservers.delete(a));}}catch(t){i.e(t);}finally{i.f();}}}},{key:"VariableStateDidChangeEvent",value:function(t,e){if(null!==this._variableObservers){var n=this._variableObservers.get(t);if(void 0!==n){if(!(e instanceof K))throw new Error("Tried to get the value of a variable that isn't a standard type");var r,i=A(e,K),a=S(n);try{for(a.s();!(r=a.n()).done;){(0,r.value)(t,i.valueObject);}}catch(t){a.e(t);}finally{a.f();}}}}},{key:"globalTags",get:function(){return this.TagsAtStartOfFlowContainerWithPathString("")}},{key:"TagsForContentAtPath",value:function(t){return this.TagsAtStartOfFlowContainerWithPathString(t)}},{key:"TagsAtStartOfFlowContainerWithPathString",value:function(t){var e=new R(t),n=this.ContentAtPath(e).container;if(null===n)return L("flowContainer");for(;;){var r=n.content[0];if(!(r instanceof tt))break;n=r;}var i,a=null,o=S(n.content);try{for(o.s();!(i=o.n()).done;){var s=_(i.value,ce);if(!s)break;null==a&&(a=[]),a.push(s.text);}}catch(t){o.e(t);}finally{o.f();}return a}},{key:"BuildStringOfHierarchy",value:function(){var t=new j;return this.mainContentContainer.BuildStringOfHierarchy(t,0,this.state.currentPointer.Resolve()),t.toString()}},{key:"BuildStringOfContainer",value:function(t){var e=new j;return t.BuildStringOfHierarchy(e,0,this.state.currentPointer.Resolve()),e.toString()}},{key:"NextContent",value:function(){if((this.state.previousPointer=this.state.currentPointer.copy(),this.state.divertedPointer.isNull||(this.state.currentPointer=this.state.divertedPointer.copy(),this.state.divertedPointer=dt.Null,this.VisitChangedContainersDueToDivert(),this.state.currentPointer.isNull))&&!this.IncrementContentPointer()){var t=!1;this.state.callStack.CanPop(ct.Function)?(this.state.PopCallStack(ct.Function),this.state.inExpressionEvaluation&&this.state.PushEvaluationStack(new rt),t=!0):this.state.callStack.canPopThread?(this.state.callStack.PopThread(),t=!0):this.state.TryExitFunctionEvaluationFromGame(),t&&!this.state.currentPointer.isNull&&this.NextContent();}}},{key:"IncrementContentPointer",value:function(){var t=!0,e=this.state.callStack.currentElement.currentPointer.copy();if(e.index++,null===e.container)return L("pointer.container");for(;e.index>=e.container.content.length;){t=!1;var n=_(e.container.parent,tt);if(n instanceof tt==!1)break;var r=n.content.indexOf(e.container);if(-1==r)break;if((e=new dt(n,r)).index++,t=!0,null===e.container)return L("pointer.container")}return t||(e=dt.Null),this.state.callStack.currentElement.currentPointer=e.copy(),t}},{key:"TryFollowDefaultInvisibleChoice",value:function(){var t=this._state.currentChoices,e=t.filter((function(t){return t.isInvisibleDefault}));if(0==e.length||t.length>e.length)return !1;var n=e[0];return null===n.targetPath?L("choice.targetPath"):null===n.threadAtGeneration?L("choice.threadAtGeneration"):(this.state.callStack.currentThread=n.threadAtGeneration,null!==this._stateSnapshotAtLastNewline&&(this.state.callStack.currentThread=this.state.callStack.ForkThread()),this.ChoosePath(n.targetPath,!1),!0)}},{key:"NextSequenceShuffleIndex",value:function(){var t=_(this.state.PopEvaluationStack(),J);if(!(t instanceof J))return this.Error("expected number of elements in sequence for shuffle index"),0;var e=this.state.currentPointer.container;if(null===e)return L("seqContainer");if(null===t.value)return L("numElementsIntVal.value");var n=t.value,r=A(this.state.PopEvaluationStack(),J).value;if(null===r)return L("seqCount");for(var i=r/n,a=r%n,o=e.path.toString(),s=0,l=0,u=o.length;l<u;l++)s+=o.charCodeAt(l)||0;for(var c=s+i+this.state.storySeed,h=new me(Math.floor(c)),f=[],d=0;d<n;++d)f.push(d);for(var v=0;v<=a;++v){var p=h.next()%f.length,m=f[p];if(f.splice(p,1),v==a)return m}throw new Error("Should never reach here")}},{key:"Error",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=new G(t);throw n.useEndLineNumber=e,n}},{key:"Warning",value:function(t){this.AddError(t,!0);}},{key:"AddError",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=this.currentDebugMetadata,i=e?"WARNING":"ERROR";if(null!=r){var a=n?r.endLineNumber:r.startLineNumber;t="RUNTIME "+i+": '"+r.fileName+"' line "+a+": "+t;}else t=this.state.currentPointer.isNull?"RUNTIME "+i+": "+t:"RUNTIME "+i+": ("+this.state.currentPointer+"): "+t;this.state.AddError(t,e),e||this.state.ForceEnd();}},{key:"Assert",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;if(0==t)throw null==e&&(e="Story assert"),new Error(e+" "+this.currentDebugMetadata)}},{key:"currentDebugMetadata",get:function(){var t,e=this.state.currentPointer;if(!e.isNull&&null!==e.Resolve()&&null!==(t=e.Resolve().debugMetadata))return t;for(var n=this.state.callStack.elements.length-1;n>=0;--n)if(!(e=this.state.callStack.elements[n].currentPointer).isNull&&null!==e.Resolve()&&null!==(t=e.Resolve().debugMetadata))return t;for(var r=this.state.outputStream.length-1;r>=0;--r){if(null!==(t=this.state.outputStream[r].debugMetadata))return t}return null}},{key:"mainContentContainer",get:function(){return this._temporaryEvaluationContainer?this._temporaryEvaluationContainer:this._mainContentContainer}}]),o}(V),t.Story.inkVersionCurrent=20,function(t){var e;(e=t.OutputStateChange||(t.OutputStateChange={}))[e.NoChange=0]="NoChange",e[e.ExtendedBeyondNewline=1]="ExtendedBeyondNewline",e[e.NewlineRemoved=2]="NewlineRemoved";}(t.Story||(t.Story={}));var ke=function(e){a(s,e);var r=d(s);function s(e){var i,a=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return n(this,s),(i=r.call(this,null,e,null,!1,a))._errorHandler=null,i._hadError=!1,i._hadWarning=!1,i._dontFlattenContainers=new Set,i._listDefs=new Map,i.constants=new Map,i.externals=new Map,i.countAllVisits=!1,i.ExportRuntime=function(){var e,n,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;i._errorHandler=r,i.constants=new Map;var a,o=S(i.FindAll(_t)());try{for(o.s();!(a=o.n()).done;){var s=a.value,l=i.constants.get(s.constantName);if(l&&!l.Equals(s.expression)){var u="CONST '".concat(s.constantName,"' has been redefined with a different value. Multiple definitions of the same CONST are valid so long as they contain the same value. Initial definition was on ").concat(l.debugMetadata,".");i.Error(u,s,!1);}i.constants.set(s.constantName,s.expression);}}catch(t){o.e(t);}finally{o.f();}i._listDefs=new Map;var c,f=S(i.FindAll(Ht)());try{for(f.s();!(c=f.n()).done;){var d=c.value;(null===(e=d.identifier)||void 0===e?void 0:e.name)&&i._listDefs.set(null===(n=d.identifier)||void 0===n?void 0:n.name,d);}}catch(t){f.e(t);}finally{f.f();}i.externals=new Map,i.ResolveWeavePointNaming();var v=i.runtimeObject,p=new tt;p.AddContent(et.EvalStart());var y,g=[],C=S(i.variableDeclarations);try{for(C.s();!(y=C.n()).done;){var b=m(y.value,2),w=b[0],k=b[1];if(k.isGlobalDeclaration){if(k.listDefinition)i._listDefs.set(w,k.listDefinition),p.AddContent(k.listDefinition.runtimeObject),g.push(k.listDefinition.runtimeListDefinition);else {if(!k.expression)throw new Error;k.expression.GenerateIntoContainer(p);}var E=new pt(w,!0);E.isGlobal=!0,p.AddContent(E);}}}catch(t){C.e(t);}finally{C.f();}p.AddContent(et.EvalEnd()),p.AddContent(et.End()),i.variableDeclarations.size>0&&(p.name="global decl",v.AddToNamedContentOnly(p)),v.AddContent(et.Done());var _=new t.Story(v,g);return i.runtimeObject=_,i.hadError?null:(i.FlattenContainersIn(v),i.ResolveReferences(h(i)),i.hadError?null:(_.ResetState(),_))},i.ResolveList=function(t){var e=i._listDefs.get(t);return e||null},i.ResolveListItem=function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,r=null;if(t)return (r=i._listDefs.get(t))?r.ItemNamed(e):null;var a,o=null,s=null,l=S(i._listDefs.entries());try{for(l.s();!(a=l.n()).done;){var u=m(a.value,2),c=u[1],h=c.ItemNamed(e);h&&(o?i.Error("Ambiguous item name '".concat(e,"' found in multiple sets, including ").concat(s.identifier," and ").concat(c.identifier),n,!1):(o=h,s=c));}}catch(t){l.e(t);}finally{l.f();}return o},i.FlattenContainersIn=function(t){var e=new Set;if(t.content){var n,r=S(t.content);try{for(r.s();!(n=r.n()).done;){var a=_(n.value,tt);a&&e.add(a);}}catch(t){r.e(t);}finally{r.f();}}if(t.namedContent){var o,s=S(t.namedContent);try{for(s.s();!(o=s.n()).done;){var l=_(m(o.value,2)[1],tt);l&&e.add(l);}}catch(t){s.e(t);}finally{s.f();}}var u,c=S(e);try{for(c.s();!(u=c.n()).done;){var h=u.value;i.TryFlattenContainer(h),i.FlattenContainersIn(h);}}catch(t){c.e(t);}finally{c.f();}},i.TryFlattenContainer=function(t){if(!(t.namedContent&&t.namedContent.size>0||t.hasValidName||i._dontFlattenContainers.has(t))){var e=_(t.parent,tt);if(e){var n=e.content.indexOf(t);e.content.splice(n,1);var r=t.ownDebugMetadata;if(t.content){var a,o=S(t.content);try{for(o.s();!(a=o.n()).done;){var s=a.value;s.parent=null,null!==r&&null===s.ownDebugMetadata&&(s.debugMetadata=r),e.InsertContent(s,n),n+=1;}}catch(t){o.e(t);}finally{o.f();}}}}},i.Error=function(t,e,n){var r=n?b.Warning:b.Error,a="";if(e instanceof F?(a+="TODO: ",r=b.Author):a+=n?"WARNING: ":"ERROR: ",e&&null!==e.debugMetadata&&e.debugMetadata.startLineNumber>=1&&(null!=e.debugMetadata.fileName&&(a+="'".concat(e.debugMetadata.fileName,"' ")),a+="line ".concat(e.debugMetadata.startLineNumber,": ")),t=a+=t,null===i._errorHandler)throw new Error(t);i._errorHandler(t,r),i._hadError=r===b.Error,i._hadWarning=r===b.Warning;},i.ResetError=function(){i._hadError=!1,i._hadWarning=!1;},i.IsExternal=function(t){return i.externals.has(t)},i.AddExternal=function(t){i.externals.has(t.name)?i.Error("Duplicate EXTERNAL definition of '".concat(t.name,"'"),t,!1):t.name&&i.externals.set(t.name,t);},i.DontFlattenContainer=function(t){i._dontFlattenContainers.add(t);},i.NameConflictError=function(t,e,n,r){t.Error("".concat(r," '").concat(e,"': name has already been used for a ").concat(n.typeName.toLowerCase()," on ").concat(n.debugMetadata));},i.CheckForNamingCollisions=function(t,e,n){var r,a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"",o=a||t.typeName;if(s.IsReservedKeyword(null==e?void 0:e.name))t.Error("'".concat(e,"' cannot be used for the name of a ").concat(o.toLowerCase()," because it's a reserved keyword"));else if(Rt.IsBuiltIn((null==e?void 0:e.name)||""))t.Error("'".concat(e,"' cannot be used for the name of a ").concat(o.toLowerCase()," because it's a built in function"));else {var l=i.ContentWithNameAtLevel((null==e?void 0:e.name)||"",bt.Knot),u=_(l,Ot);if(!u||u===t&&n!==ft.Arg){if(!(n<ft.List)){var c,h=S(i._listDefs);try{for(h.s();!(c=h.n()).done;){var f=m(c.value,2),d=f[0],v=f[1];if((null==e?void 0:e.name)===d&&t!==v&&v.variableAssignment!==t&&i.NameConflictError(t,null==e?void 0:e.name,v,o),!(t instanceof le)){var p,y=S(v.itemDefinitions);try{for(y.s();!(p=y.n()).done;){var g=p.value;(null==e?void 0:e.name)===g.name&&i.NameConflictError(t,(null==e?void 0:e.name)||"",g,o);}}catch(t){y.e(t);}finally{y.f();}}}}catch(t){h.e(t);}finally{h.f();}if(!(n<=ft.Var)){var C=(null==e?void 0:e.name)&&i.variableDeclarations.get(null==e?void 0:e.name)||null;if(C&&C!==t&&C.isGlobalDeclaration&&null==C.listDefinition&&i.NameConflictError(t,(null==e?void 0:e.name)||"",C,o),!(n<ft.SubFlowAndWeave)){var b=new Tt(e),w=b.ResolveFromContext(t);if(w&&w!==t)i.NameConflictError(t,(null==e?void 0:e.name)||"",w,o);else if(!(n<ft.Arg)&&n!==ft.Arg){var k=_(t,Ot);if(k||(k=xt(t)),k&&k.hasParameters&&k.args){var E,A=S(k.args);try{for(A.s();!(E=A.n()).done;){var T=E.value;if((null===(r=T.identifier)||void 0===r?void 0:r.name)===(null==e?void 0:e.name))return void t.Error("".concat(o," '").concat(e,"': name has already been used for a argument to ").concat(k.identifier," on ").concat(k.debugMetadata))}}catch(t){A.e(t);}finally{A.f();}}}}}}}else i.NameConflictError(t,(null==e?void 0:e.name)||"",u,o);}},i}return i(s,[{key:"flowLevel",get:function(){return bt.Story}},{key:"hadError",get:function(){return this._hadError}},{key:"hadWarning",get:function(){return this._hadWarning}},{key:"typeName",get:function(){return "Story"}},{key:"PreProcessTopLevelObjects",value:function(t){p(o(s.prototype),"PreProcessTopLevelObjects",this).call(this,t);var e,n=[],r=S(t);try{for(r.s();!(e=r.n()).done;){var i=e.value;if(i instanceof ie){var a=i,l=t.indexOf(i);if(t.splice(l,1),a.includedStory){var u=[],c=a.includedStory;if(null!=c.content){var h,f=S(c.content);try{for(f.s();!(h=f.n()).done;){var d=h.value;d instanceof Ot?n.push(d):u.push(d);}}catch(t){f.e(t);}finally{f.f();}u.push(new Et("\n")),t.splice.apply(t,[l,0].concat(u));}}}else ;}}catch(t){r.e(t);}finally{r.f();}t.splice.apply(t,[0,0].concat(n));}}]),s}(Ot);ke.IsReservedKeyword=function(t){switch(t){case"true":case"false":case"not":case"return":case"else":case"VAR":case"CONST":case"temp":case"LIST":case"function":return !0}return !1};var Ee=function(t){a(r,t);var e=d(r);function r(t){var i;return n(this,r),(i=e.call(this)).GenerateIntoContainer=function(t){t.AddContent(et.BeginString());var e,n=S(i.content);try{for(n.s();!(e=n.n()).done;){var r=e.value;t.AddContent(r.runtimeObject);}}catch(t){n.e(t);}finally{n.f();}t.AddContent(et.EndString());},i.toString=function(){var t,e="",n=S(i.content);try{for(n.s();!(t=n.n()).done;){e+=t.value;}}catch(t){n.e(t);}finally{n.f();}return e},i.AddContent(t),i}return i(r,[{key:"isSingleString",get:function(){return 1===this.content.length&&this.content[0]instanceof Et}},{key:"typeName",get:function(){return "String"}},{key:"Equals",value:function(t){var e=_(t,r);return null!==e&&(!(!this.isSingleString||!e.isSingleString)&&this.toString()===e.toString())}}]),r}(nt),_e=function(t){a(r,t);var e=d(r);function r(t){return n(this,r),e.call(this,t)}return i(r,[{key:"typeName",get:function(){return "Tag"}}]),r}(te),Ae=i((function t(e){n(this,t),this.rootPath=e,this.ResolveInkFilename=function(){throw Error("Can't resolve filename because no FileHandler was provided when instantiating the parser / compiler.")},this.LoadInkFileContents=function(){throw Error("Can't load ink content because no FileHandler was provided when instantiating the parser / compiler.")};})),Te=function(t){a(o,t);var r=d(o);function o(t){var i,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,l=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,u=arguments.length>4&&void 0!==arguments[4]?arguments[4]:null;if(n(this,o),(i=r.call(this,t)).ParseStory=function(){var t=i.StatementsAtLevel(Xt.Top);return new ke(t,i._rootParser!==h(i))},i.SeparatedList=function(t,e){var n=i.Parse(t);if(null===n)return null;var r=[];for(r.push(n);;){var a=i.BeginRule();if(null===e()){i.FailRule(a);break}var o=i.Parse(t);if(null===o){i.FailRule(a);break}i.SucceedRule(a),r.push(o);}return r},i.CreateDebugMetadata=function(t,e){var n=new Yt;return n.startLineNumber=((null==t?void 0:t.lineIndex)||0)+1,n.endLineNumber=e.lineIndex+1,n.startCharacterNumber=((null==t?void 0:t.characterInLineIndex)||0)+1,n.endCharacterNumber=e.characterInLineIndex+1,n.fileName=i._filename,n},i.RuleDidSucceed=function(t,e,n){var r=_(t,W);r&&(r.debugMetadata=i.CreateDebugMetadata(e,n));var a=Array.isArray(t)?t:null;if(null!==a){var o,s=S(a);try{for(s.s();!(o=s.n()).done;){var l=o.value;_(l,W)&&(l.hasOwnDebugMetadata||(l.debugMetadata=i.CreateDebugMetadata(e,n)));}}catch(t){s.e(t);}finally{s.f();}}var u=_(t,Nt);null!=u&&(u.debugMetadata=i.CreateDebugMetadata(e,n));},i.OnStringParserError=function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=arguments.length>3&&void 0!==arguments[3]&&arguments[3],a=r?"WARNING:":"ERROR:",o=a;if(null!==i._filename&&(o+=" '".concat(i._filename,"'")),o+=" line ".concat(n+1,": ").concat(t),null===i._externalErrorHandler)throw new Error(o);i._externalErrorHandler(o,r?b.Warning:b.Error);},i.AuthorWarning=function(){i.Whitespace();var t=i.Parse(i.IdentifierWithMetadata);if(null===t||"TODO"!==t.name)return null;i.Whitespace(),i.ParseString(":"),i.Whitespace();var e=i.ParseUntilCharactersFromString("\n\r");return e?new F(e):null},i.ExtendIdentifierCharacterRanges=function(t){var e,n=S(o.ListAllCharacterRanges());try{for(n.s();!(e=n.n()).done;){var r=e.value;t.AddCharacters(r.ToCharacterSet());}}catch(t){n.e(t);}finally{n.f();}},i._parsingChoice=!1,i.Choice=function(){var t=!0,e=i.Interleave(i.OptionalExclude(i.Whitespace),i.String("*"));if(!e){if(null===(e=i.Interleave(i.OptionalExclude(i.Whitespace),i.String("+"))))return null;t=!1;}var n=i.Parse(i.BracketedName);i.Whitespace();var r=i.Parse(i.ChoiceCondition);if(i.Whitespace(),i._parsingChoice)throw new Error("Already parsing a choice - shouldn't have nested choices");i._parsingChoice=!0;var a=null,o=i.Parse(i.MixedTextAndLogic);o&&(a=new It(o));var s=null,l=null,u=null!==i.ParseString("[");if(u){var c=i.Parse(i.MixedTextAndLogic);null!==c&&(s=new It(c)),i.Expect(i.String("]"),"closing ']' for weave-style option");var h=i.Parse(i.MixedTextAndLogic);null!==h&&(l=new It(h));}i.Whitespace();var f=i.Parse(i.MultiDivert);i._parsingChoice=!1,i.Whitespace();var d=!a&&!l&&!s;d&&null===f&&i.Warning("Choice is completely empty. Interpretting as a default fallback choice. Add a divert arrow to remove this warning: * ->"),a||!u||s||i.Warning("Blank choice - if you intended a default fallback choice, use the `* ->` syntax"),l||(l=new It);var v=i.Parse(i.Tags);if(null!==v&&l.AddContent(v),null!==f){var p,m=S(f);try{for(m.s();!(p=m.n()).done;){var y=p.value,g=_(y,jt);g&&g.isEmpty||l.AddContent(y);}}catch(t){m.e(t);}finally{m.f();}}l.AddContent(new Et("\n"));var C=new mt(a,s,l);return n&&(C.identifier=n),C.indentationDepth=e.length,C.hasWeaveStyleInlineBrackets=u,C.condition=r,C.onceOnly=t,C.isInvisibleDefault=d,C},i.ChoiceCondition=function(){var t=i.Interleave(i.ChoiceSingleCondition,i.ChoiceConditionsSpace);return null===t?null:1===t.length?t[0]:new Lt(t)},i.ChoiceConditionsSpace=function(){return i.Newline(),i.Whitespace(),Ct},i.ChoiceSingleCondition=function(){if(null===i.ParseString("{"))return null;var t=i.Expect(i.Expression,"choice condition inside { }");return i.DisallowIncrement(t),i.Expect(i.String("}"),"closing '}' for choice condition"),t},i.Gather=function(){var t=i.Parse(i.GatherDashes);if(null===t)return null;var e=Number(t),n=i.Parse(i.BracketedName),r=new At(n,e);return i.Newline(),r},i.GatherDashes=function(){i.Whitespace();for(var t=0;null!==i.ParseDashNotArrow();)t+=1,i.Whitespace();return 0===t?null:t},i.ParseDashNotArrow=function(){var t=i.BeginRule();return null===i.ParseString("->")&&"-"===i.ParseSingleCharacter()?i.SucceedRule(t):i.FailRule(t)},i.BracketedName=function(){if(null===i.ParseString("("))return null;i.Whitespace();var t=i.Parse(i.IdentifierWithMetadata);return null===t?null:(i.Whitespace(),i.Expect(i.String(")"),"closing ')' for bracketed name"),t)},i.InnerConditionalContent=function(t){if(void 0===t){var e=i.Parse(i.ConditionExpression),n=i.Parse((function(){return i.InnerConditionalContent(e)}));return null===n?null:n}var r,a=null!==t,o=null===i.Parse(i.Newline);if(o&&!a)return null;if(o)r=i.InlineConditionalBranches();else {if(null===(r=i.MultilineConditionalBranches())){if(t){var s=i.StatementsAtLevel(Xt.InnerBlock);if(null!==s){r=[new $t(s)];var l=i.Parse(i.SingleMultilineCondition);l&&(l.isElse||(i.ErrorWithParsedObject("Expected an '- else:' clause here rather than an extra condition",l),l.isElse=!0),r.push(l));}}if(null===r)return null}else if(1===r.length&&r[0].isElse&&t){var u=new $t(null);u.isTrueBranch=!0,r.unshift(u);}if(t)for(var c=!1,h=0;h<r.length;++h){var f=r[h],d=h===r.length-1;f.ownExpression?(f.matchingEquality=!0,c=!0):c&&d?(f.matchingEquality=!0,f.isElse=!0):!d&&r.length>2?i.ErrorWithParsedObject("Only final branch can be an 'else'. Did you miss a ':'?",f):0===h?f.isTrueBranch=!0:f.isElse=!0;}else {for(var v=0;v<r.length;++v){var p=r[v],m=v===r.length-1;if(null===p.ownExpression)if(m)p.isElse=!0;else if(p.isElse){var y=r[r.length-1];y.isElse?i.ErrorWithParsedObject("Multiple 'else' cases. Can have a maximum of one, at the end.",y):i.ErrorWithParsedObject("'else' case in conditional should always be the final one",p);}else i.ErrorWithParsedObject("Branch doesn't have condition. Are you missing a ':'? ",p);}1===r.length&&null===r[0].ownExpression&&i.ErrorWithParsedObject("Condition block with no conditions",r[0]);}}if(null===r)return null;var g,C=S(r);try{for(C.s();!(g=C.n()).done;){g.value.isInline=o;}}catch(t){C.e(t);}finally{C.f();}return new kt(t,r)},i.InlineConditionalBranches=function(){var t=i.Interleave(i.MixedTextAndLogic,i.Exclude(i.String("|")),null,!1);if(null===t||0===t.length)return null;var e=[];if(t.length>2)i.Error("Expected one or two alternatives separated by '|' in inline conditional");else {var n=new $t(t[0]);if(n.isTrueBranch=!0,e.push(n),t.length>1){var r=new $t(t[1]);r.isElse=!0,e.push(r);}}return e},i.MultilineConditionalBranches=function(){i.MultilineWhitespace();var t=i.OneOrMore(i.SingleMultilineCondition);return null===t?null:(i.MultilineWhitespace(),t)},i.SingleMultilineCondition=function(){if(i.Whitespace(),null!==i.ParseString("->")||null===i.ParseString("-"))return null;i.Whitespace();var t=null,e=null!==i.Parse(i.ElseExpression);e||(t=i.Parse(i.ConditionExpression));var n=i.StatementsAtLevel(Xt.InnerBlock);null===t&&null===n&&(i.Error("expected content for the conditional branch following '-'"),n=[new Et("")]),i.MultilineWhitespace();var r=new $t(n);return r.ownExpression=t,r.isElse=e,r},i.ConditionExpression=function(){var t=i.Parse(i.Expression);return null===t?null:(i.DisallowIncrement(t),i.Whitespace(),null===i.ParseString(":")?null:t)},i.ElseExpression=function(){return null===i.ParseString("else")?null:(i.Whitespace(),null===i.ParseString(":")?null:Ct)},i._nonTextPauseCharacters=null,i._nonTextEndCharacters=null,i._notTextEndCharactersChoice=null,i._notTextEndCharactersString=null,i.TrimEndWhitespace=function(t,e){if(t.length>0){var n=t.length-1,r=t[n];if(r instanceof Et){var a=r;a.text=a.text.replace(new RegExp(/[ \t]+$/g),""),e?a.text+=" ":0===a.text.length&&(t.splice(n,1),i.TrimEndWhitespace(t,!1));}}},i.LineOfMixedTextAndLogic=function(){i.Parse(i.Whitespace);var t=i.Parse(i.MixedTextAndLogic),e=!1,n=i.Parse(i.Tags);if(n)if(t){var r,a=S(n);try{for(a.s();!(r=a.n()).done;){var o=r.value;t.push(o);}}catch(t){a.e(t);}finally{a.f();}}else t=n,e=!0;if(!t||!t.length)return null;var s=t[0];return s&&s.text&&s.text.startsWith("return")&&i.Warning("Do you need a '~' before 'return'? If not, perhaps use a glue: <> (since it's lowercase) or rewrite somehow?"),0===t.length?null:(t[t.length-1]instanceof jt||i.TrimEndWhitespace(t,!1),e||t.push(new Et("\n")),i.Expect(i.EndOfLine,"end of line",i.SkipToNextLine),t)},i.MixedTextAndLogic=function(){null!==i.ParseObject(i.Spaced(i.String("~")))&&i.Error("You shouldn't use a '~' here - tildas are for logic that's on its own line. To do inline logic, use { curly braces } instead");var t=i.Interleave(i.Optional(i.ContentText),i.Optional(i.InlineLogicOrGlue));if(!i._parsingChoice){var e,n=i.Parse(i.MultiDivert);if(null!==n)null===t&&(t=[]),i.TrimEndWhitespace(t,!0),(e=t).push.apply(e,y(n));}return t||null},i.ContentText=function(){return i.ContentTextAllowingEscapeChar()},i.ContentTextAllowingEscapeChar=function(){for(var t=null;;){var e=i.Parse(i.ContentTextNoEscape),n=null!==i.ParseString("\\");if(!n&&null===e)break;null===t&&(t=""),null!==e&&(t+=String(e)),n&&(t+=i.ParseSingleCharacter());}return null!==t?new Et(t):null},i.ContentTextNoEscape=function(){null===i._nonTextPauseCharacters&&(i._nonTextPauseCharacters=new lt("-<")),null===i._nonTextEndCharacters&&(i._nonTextEndCharacters=new lt("{}|\n\r\\#"),i._notTextEndCharactersChoice=new lt(i._nonTextEndCharacters),i._notTextEndCharactersChoice.AddCharacters("[]"),i._notTextEndCharactersString=new lt(i._nonTextEndCharacters),i._notTextEndCharactersString.AddCharacters('"'));var t=null;t=i.parsingStringExpression?i._notTextEndCharactersString:i._parsingChoice?i._notTextEndCharactersChoice:i._nonTextEndCharacters;var e=i.ParseUntil((function(){return i.OneOf([i.ParseDivertArrow,i.ParseThreadArrow,i.EndOfLine,i.Glue])}),i._nonTextPauseCharacters,t);return null!==e?e:null},i.MultiDivert=function(){i.Whitespace();var t=[],e=i.Parse(i.StartThread);if(e)return t=[e];var n=i.Interleave(i.ParseDivertArrowOrTunnelOnwards,i.DivertIdentifierWithArguments);if(!n)return null;t=[];for(var r=0;r<n.length;++r){if(r%2==0){if("->->"===n[r]){0===r||r===n.length-1||r===n.length-2||i.Error("Tunnel onwards '->->' must only come at the begining or the start of a divert");var a=new Ut;if(r<n.length-1){var o=_(n[r+1],jt);a.divertAfter=o;}t.push(a);break}}else {var s=n[r];r<n.length-1&&(s.isTunnel=!0),t.push(s);}}if(0===t.length&&1===n.length){var l=new jt(null);l.isEmpty=!0,t.push(l),i._parsingChoice||i.Error("Empty diverts (->) are only valid on choices");}return t},i.StartThread=function(){if(i.Whitespace(),null===i.ParseThreadArrow())return null;i.Whitespace();var t=i.Expect(i.DivertIdentifierWithArguments,"target for new thread",(function(){return new jt(null)}));return t.isThread=!0,t},i.DivertIdentifierWithArguments=function(){i.Whitespace();var t=i.Parse(i.DotSeparatedDivertPathComponents);if(!t)return null;i.Whitespace();var e=i.Parse(i.ExpressionFunctionCallArguments);i.Whitespace();var n=new Tt(t);return new jt(n,e)},i.SingleDivert=function(){var t=i.Parse(i.MultiDivert);if(!t)return null;if(1!==t.length)return null;if(t[0]instanceof Ut)return null;var e=t[0];return e.isTunnel?null:e},i.DotSeparatedDivertPathComponents=function(){return i.Interleave(i.Spaced(i.IdentifierWithMetadata),i.Exclude(i.String(".")))},i.ParseDivertArrowOrTunnelOnwards=function(){for(var t=0;null!==i.ParseString("->");)t+=1;return 0===t?null:1===t?"->":(2===t||i.Error("Unexpected number of arrows in divert. Should only have '->' or '->->'"),"->->")},i.ParseDivertArrow=function(){return i.ParseString("->")},i.ParseThreadArrow=function(){return i.ParseString("<-")},i._binaryOperators=[],i._maxBinaryOpLength=0,i.TempDeclarationOrAssignment=function(){i.Whitespace();var t=i.ParseTempKeyword();i.Whitespace();var e=null;if(null===(e=t?i.Expect(i.IdentifierWithMetadata,"variable name"):i.Parse(i.IdentifierWithMetadata)))return null;i.Whitespace();var n=null!==i.ParseString("+"),r=null!==i.ParseString("-");if(n&&r&&i.Error("Unexpected sequence '+-'"),null===i.ParseString("="))return t&&i.Error("Expected '='"),null;var a=i.Expect(i.Expression,"value expression to be assigned");return n||r?new re(e,a,n):new Jt({variableIdentifier:e,assignedExpression:a,isTemporaryNewDeclaration:t})},i.DisallowIncrement=function(t){t instanceof re&&i.Error("Can't use increment/decrement here. It can only be used on a ~ line");},i.ParseTempKeyword=function(){var t=i.BeginRule();return "temp"===i.Parse(i.Identifier)?(i.SucceedRule(t),!0):(i.FailRule(t),!1)},i.ReturnStatement=function(){if(i.Whitespace(),"return"!==i.Parse(i.Identifier))return null;i.Whitespace();var t=i.Parse(i.Expression);return new Pt(t)},i.Expression=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;i.Whitespace();var n=i.ExpressionUnary();if(null===n)return null;i.Whitespace();for(var r=function(){var e=i.BeginRule(),r=i.ParseInfixOperator();if(null!==r&&r.precedence>t){var a="right side of '".concat(r.type,"' expression"),o=i.Expect((function(){return i.ExpressionInfixRight(n,r)}),a);return null===o?(i.FailRule(e),{v:null}):(n=i.SucceedRule(e,o),"continue")}return i.FailRule(e),"break"};;){var a=r();if("continue"!==a){if("break"===a)break;if("object"===e(a))return a.v}}return i.Whitespace(),n},i.ExpressionUnary=function(){var t=i.Parse(i.ExpressionDivertTarget);if(null!==t)return t;var e=i.OneOf([i.String("-"),i.String("!")]);null===e&&(e=i.Parse(i.ExpressionNot)),i.Whitespace();var n=i.OneOf([i.ExpressionList,i.ExpressionParen,i.ExpressionFunctionCall,i.ExpressionVariableName,i.ExpressionLiteral]);if(null===n&&null!==e&&(n=i.ExpressionUnary()),null===n)return null;null!==e&&(n=ot.WithInner(n,e)),i.Whitespace();var r=i.OneOf([i.String("++"),i.String("--")]);if(null!==r){var a="++"===r;if(n instanceof Ft)n=new re(n.identifier,a);else i.Error("can only increment and decrement variables, but saw '".concat(n,"'."));}return n},i.ExpressionNot=function(){var t=i.Identifier();return "not"===t?t:null},i.ExpressionLiteral=function(){return i.OneOf([i.ExpressionFloat,i.ExpressionInt,i.ExpressionBool,i.ExpressionString])},i.ExpressionDivertTarget=function(){i.Whitespace();var t=i.Parse(i.SingleDivert);return !t||t&&t.isThread?null:(i.Whitespace(),new Vt(t))},i.ExpressionInt=function(){var t=i.ParseInt();return null===t?null:new at(t,"int")},i.ExpressionFloat=function(){var t=i.ParseFloat();return null===t?null:new at(t,"float")},i.ExpressionString=function(){if(null===i.ParseString('"'))return null;i.parsingStringExpression=!0;var t=i.Parse(i.MixedTextAndLogic);return i.Expect(i.String('"'),"close quote for string expression"),i.parsingStringExpression=!1,null===t?t=[new Et("")]:t.find((function(t){return t instanceof jt}))&&i.Error("String expressions cannot contain diverts (->)"),new Ee(t)},i.ExpressionBool=function(){var t=i.Parse(i.Identifier);return "true"===t?new at(!0,"bool"):"false"===t?new at(!1,"bool"):null},i.ExpressionFunctionCall=function(){var t=i.Parse(i.IdentifierWithMetadata);if(null===t)return null;i.Whitespace();var e=i.Parse(i.ExpressionFunctionCallArguments);return null===e?null:new Rt(t,e)},i.ExpressionFunctionCallArguments=function(){if(null===i.ParseString("("))return null;var t=i.Exclude(i.String(",")),e=i.Interleave(i.Expression,t);return null===e&&(e=[]),i.Whitespace(),i.Expect(i.String(")"),"closing ')' for function call"),e},i.ExpressionVariableName=function(){var t=i.Interleave(i.IdentifierWithMetadata,i.Exclude(i.Spaced(i.String("."))));return null===t||ke.IsReservedKeyword(t[0].name)?null:new Ft(t)},i.ExpressionParen=function(){if(null===i.ParseString("("))return null;var t=i.Parse(i.Expression);return null===t?null:(i.Whitespace(),i.Expect(i.String(")"),"closing parenthesis ')' for expression"),t)},i.ExpressionInfixRight=function(t,e){if(!t)return null;i.Whitespace();var n=i.Parse((function(){return i.Expression(e.precedence)}));return n?new st(t,n,e.type):null},i.ParseInfixOperator=function(){var t,e=S(i._binaryOperators);try{for(e.s();!(t=e.n()).done;){var n=t.value,r=i.BeginRule();if(null!==i.ParseString(n.type)){if(n.requireWhitespace&&null===i.Whitespace()){i.FailRule(r);continue}return i.SucceedRule(r,n)}i.FailRule(r);}}catch(t){e.e(t);}finally{e.f();}return null},i.ExpressionList=function(){if(i.Whitespace(),null===i.ParseString("("))return null;i.Whitespace();var t=i.SeparatedList(i.ListMember,i.Spaced(i.String(",")));return i.Whitespace(),null===i.ParseString(")")?null:new se(t)},i.ListMember=function(){i.Whitespace();var t=i.Parse(i.IdentifierWithMetadata);if(null===t)return null;if(null!==i.ParseString(".")){var e=i.Expect(i.IdentifierWithMetadata,"element name within the set ".concat(t));t.name+=".".concat(null==e?void 0:e.name);}return i.Whitespace(),t},i.RegisterExpressionOperators=function(){i.RegisterBinaryOperator("&&",1),i.RegisterBinaryOperator("||",1),i.RegisterBinaryOperator("and",1,!0),i.RegisterBinaryOperator("or",1,!0),i.RegisterBinaryOperator("==",2),i.RegisterBinaryOperator(">=",2),i.RegisterBinaryOperator("<=",2),i.RegisterBinaryOperator("<",2),i.RegisterBinaryOperator(">",2),i.RegisterBinaryOperator("!=",2),i.RegisterBinaryOperator("?",3),i.RegisterBinaryOperator("has",3,!0),i.RegisterBinaryOperator("!?",3),i.RegisterBinaryOperator("hasnt",3,!0),i.RegisterBinaryOperator("^",3),i.RegisterBinaryOperator("+",4),i.RegisterBinaryOperator("-",5),i.RegisterBinaryOperator("*",6),i.RegisterBinaryOperator("/",7),i.RegisterBinaryOperator("%",8),i.RegisterBinaryOperator("mod",8,!0);},i.RegisterBinaryOperator=function(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=new ae(t,e,n);i._binaryOperators.push(r),i._maxBinaryOpLength=Math.max(i._maxBinaryOpLength,t.length);},i._openFilenames=[],i.IncludeStatement=function(){if(i.Whitespace(),null===i.ParseString("INCLUDE"))return null;i.Whitespace();var t=i.Expect((function(){return i.ParseUntilCharactersFromString("\n\r")}),"filename for include statement");t=t.replace(new RegExp(/[ \t]+$/g),"");var e=i.fileHandler.ResolveInkFilename(t);if(i.FilenameIsAlreadyOpen(e))return i.Error("Recursive INCLUDE detected: '".concat(e,"' is already open.")),i.ParseUntilCharactersFromString("\r\n"),new ie(null);i.AddOpenFilename(e);var n=null,r="";try{r=i._rootParser.fileHandler.LoadInkFileContents(e);}catch(e){i.Error("Failed to load: '".concat(t,"'.\nError:").concat(e));}r&&(n=new o(r,t,i._externalErrorHandler,i._rootParser,i.fileHandler).ParseStory());return i.RemoveOpenFilename(e),new ie(n)},i.FilenameIsAlreadyOpen=function(t){return i._rootParser._openFilenames.includes(t)},i.AddOpenFilename=function(t){i._rootParser._openFilenames.push(t);},i.RemoveOpenFilename=function(t){i._rootParser._openFilenames.splice(i._rootParser._openFilenames.indexOf(t),1);},i.KnotDefinition=function(){var t=i.Parse(i.KnotDeclaration);if(null===t)return null;i.Expect(i.EndOfLine,"end of line after knot name definition",i.SkipToNextLine);var e=i.Expect((function(){return i.StatementsAtLevel(Xt.Knot)}),"at least one line within the knot",i.KnotStitchNoContentRecoveryRule);return new oe(t.name,e,t.args,t.isFunction)},i.KnotDeclaration=function(){if(i.Whitespace(),null===i.KnotTitleEquals())return null;i.Whitespace();var t,e=i.Parse(i.IdentifierWithMetadata),n="function"===(null==e?void 0:e.name);n?(i.Expect(i.Whitespace,"whitespace after the 'function' keyword"),t=i.Parse(i.IdentifierWithMetadata)):t=e,null===t&&(i.Error("Expected the name of the ".concat(n?"function":"knot")),t=new Nt("")),i.Whitespace();var r=i.Parse(i.BracketedKnotDeclArguments);return i.Whitespace(),i.Parse(i.KnotTitleEquals),new Qt(t,r,n)},i.KnotTitleEquals=function(){var t=i.ParseCharactersFromString("=");return null===t||t.length<=1?null:t},i.StitchDefinition=function(){var t=i.Parse(i.StitchDeclaration);if(null===t)return null;i.Expect(i.EndOfLine,"end of line after stitch name",i.SkipToNextLine);var e=i.Expect((function(){return i.StatementsAtLevel(Xt.Stitch)}),"at least one line within the stitch",i.KnotStitchNoContentRecoveryRule);return new ue(t.name,e,t.args,t.isFunction)},i.StitchDeclaration=function(){if(i.Whitespace(),null===i.ParseString("="))return null;if(null!==i.ParseString("="))return null;i.Whitespace();var t=null!==i.ParseString("function");t&&i.Whitespace();var e=i.Parse(i.IdentifierWithMetadata);if(null===e)return null;i.Whitespace();var n=i.Parse(i.BracketedKnotDeclArguments);return i.Whitespace(),new Qt(e,n,t)},i.KnotStitchNoContentRecoveryRule=function(){return i.ParseUntil(i.KnotDeclaration,new lt("="),null),[new Et("<ERROR IN FLOW>")]},i.BracketedKnotDeclArguments=function(){if(null===i.ParseString("("))return null;var t=i.Interleave(i.Spaced(i.FlowDeclArgument),i.Exclude(i.String(",")));return i.Expect(i.String(")"),"closing ')' for parameter list"),null===t&&(t=[]),t},i.FlowDeclArgument=function(){var t=i.Parse(i.IdentifierWithMetadata);i.Whitespace();var e=i.ParseDivertArrow();i.Whitespace();var n=i.Parse(i.IdentifierWithMetadata);if(null==t&&null===n)return null;var r=new E;return null!==e&&(r.isDivertTarget=!0),null!==t&&"ref"===t.name?(null===n&&i.Error("Expected an parameter name after 'ref'"),r.identifier=n,r.isByReference=!0):(r.isDivertTarget?r.identifier=n:r.identifier=t,null===r.identifier&&i.Error("Expected an parameter name"),r.isByReference=!1),r},i.ExternalDeclaration=function(){i.Whitespace();var t=i.Parse(i.IdentifierWithMetadata);if(null===t||"EXTERNAL"!=t.name)return null;i.Whitespace();var e=i.Expect(i.IdentifierWithMetadata,"name of external function")||new Nt("");i.Whitespace();var n=i.Expect(i.BracketedKnotDeclArguments,"declaration of arguments for EXTERNAL, even if empty, i.e. 'EXTERNAL ".concat(e,"()'"));null===n&&(n=[]);var r=n.map((function(t){var e;return null===(e=t.identifier)||void 0===e?void 0:e.name})).filter(O);return new Zt(e,r)},i._identifierCharSet=null,i.LogicLine=function(){if(i.Whitespace(),null===i.ParseString("~"))return null;i.Whitespace();var t=i.Expect((function(){return i.OneOf([i.ReturnStatement,i.TempDeclarationOrAssignment,i.Expression])}),"expression after '~'",i.SkipToNextLine);if(null===t)return new It;t instanceof nt&&!(t instanceof Rt||t instanceof re)&&i.Error("Logic following a '~' can't be that type of expression. It can only be something like:\n\t~ return\n\t~ var x = blah\n\t~ x++\n\t~ myFunction()");var e=_(t,Rt);return e&&(e.shouldPopReturnedValue=!0),null!==t.Find(Rt)()&&(t=new It(t,new Et("\n"))),i.Expect(i.EndOfLine,"end of line",i.SkipToNextLine),t},i.VariableDeclaration=function(){if(i.Whitespace(),"VAR"!==i.Parse(i.Identifier))return null;i.Whitespace();var t=i.Expect(i.IdentifierWithMetadata,"variable name");i.Whitespace(),i.Expect(i.String("="),"the '=' for an assignment of a value, e.g. '= 5' (initial values are mandatory)"),i.Whitespace();var e=i.Expect(i.Expression,"initial value for ");if(e){if(e instanceof at||e instanceof Ee||e instanceof Vt||e instanceof Ft||e instanceof se||i.Error("initial value for a variable must be a number, constant, list or divert target"),null!==i.Parse(i.ListElementDefinitionSeparator))i.Error("Unexpected ','. If you're trying to declare a new list, use the LIST keyword, not VAR");else if(e instanceof Ee){e.isSingleString||i.Error("Constant strings cannot contain any logic.");}return new Jt({assignedExpression:e,isGlobalDeclaration:!0,variableIdentifier:t})}return null},i.ListDeclaration=function(){if(i.Whitespace(),"LIST"!=i.Parse(i.Identifier))return null;i.Whitespace();var t=i.Expect(i.IdentifierWithMetadata,"list name");i.Whitespace(),i.Expect(i.String("="),"the '=' for an assignment of the list definition"),i.Whitespace();var e=i.Expect(i.ListDefinition,"list item names");return e?(e.identifier=new Nt(t.name),new Jt({variableIdentifier:t,listDef:e})):null},i.ListDefinition=function(){i.AnyWhitespace();var t=i.SeparatedList(i.ListElementDefinition,i.ListElementDefinitionSeparator);return null===t?null:new Ht(t)},i.ListElementDefinitionSeparator=function(){return i.AnyWhitespace(),null===i.ParseString(",")?null:(i.AnyWhitespace(),",")},i.ListElementDefinition=function(){var t=null!==i.ParseString("("),e=t;i.Whitespace();var n=i.Parse(i.IdentifierWithMetadata);if(null===n)return null;i.Whitespace(),t&&null!=i.ParseString(")")&&(e=!1,i.Whitespace());var r=null;if(null!==i.ParseString("=")){i.Whitespace();var a=i.Expect(i.ExpressionInt,"value to be assigned to list item");null!==a&&(r=a.value),e&&(i.Whitespace(),null!==i.ParseString(")")&&(e=!1));}return e&&i.Error("Expected closing ')'"),new le(n,t,r)},i.ConstDeclaration=function(){if(i.Whitespace(),"CONST"!==i.Parse(i.Identifier))return null;i.Whitespace();var t=i.Expect(i.IdentifierWithMetadata,"constant name");i.Whitespace(),i.Expect(i.String("="),"the '=' for an assignment of a value, e.g. '= 5' (initial values are mandatory)"),i.Whitespace();var e=i.Expect(i.Expression,"initial value for ");if(e instanceof at||e instanceof Vt||e instanceof Ee){if(e instanceof Ee){e.isSingleString||i.Error("Constant strings cannot contain any logic.");}}else i.Error("initial value for a constant must be a number or divert target");return new _t(t,e)},i.InlineLogicOrGlue=function(){return i.OneOf([i.InlineLogic,i.Glue])},i.Glue=function(){return null!==i.ParseString("<>")?new ee(new ne):null},i.InlineLogic=function(){if(null===i.ParseString("{"))return null;i.Whitespace();var t=i.Expect(i.InnerLogic,"some kind of logic, conditional or sequence within braces: { ... }");if(null===t)return null;i.DisallowIncrement(t);var e=_(t,It);return e||(e=new It(t)),i.Whitespace(),i.Expect(i.String("}"),"closing brace '}' for inline logic"),e},i.InnerLogic=function(){i.Whitespace();var t=i.ParseObject(i.SequenceTypeAnnotation);if(null!==t){var e=i.Expect(i.InnerSequenceObjects,"sequence elements (for cycle/stoping etc)");return null===e?null:new qt(e,t)}var n=i.Parse(i.ConditionExpression);if(n)return i.Expect((function(){return i.InnerConditionalContent(n)}),"conditional content following query");for(var r=0,a=[i.InnerConditionalContent,i.InnerSequence,i.InnerExpression];r<a.length;r++){var o=a[r],s=i.BeginRule(),l=i.ParseObject(o);if(l){if(null!==i.Peek(i.Spaced(i.String("}"))))return i.SucceedRule(s,l);i.FailRule(s);}else i.FailRule(s);}return null},i.InnerExpression=function(){var t=i.Parse(i.Expression);return t&&(t.outputWhenComplete=!0),t},i.IdentifierWithMetadata=function(){var t=i.Identifier();return null===t?null:new Nt(t)},i.Identifier=function(){var t=i.ParseCharactersFromCharSet(i.identifierCharSet);if(null===t)return null;var e,n=!0,r=S(t);try{for(r.s();!(e=r.n()).done;){var a=e.value;if(!(a>="0"&&a<="9")){n=!1;break}}}catch(t){r.e(t);}finally{r.f();}return n?null:t},i._sequenceTypeSymbols=new lt("!&~$"),i.InnerSequence=function(){i.Whitespace();var t=Dt.Stopping,e=i.Parse(i.SequenceTypeAnnotation);null!==e&&(t=e);var n=i.Parse(i.InnerSequenceObjects);return null===n||n.length<=1?null:new qt(n,t)},i.SequenceTypeAnnotation=function(){var t=i.Parse(i.SequenceTypeSymbolAnnotation);if(null===t&&(t=i.Parse(i.SequenceTypeWordAnnotation)),null===t)return null;switch(t){case Dt.Once:case Dt.Cycle:case Dt.Stopping:case Dt.Shuffle:case Dt.Shuffle|Dt.Stopping:case Dt.Shuffle|Dt.Once:break;default:return i.Error("Sequence type combination not supported: ".concat(t)),Dt.Stopping}return t},i.SequenceTypeSymbolAnnotation=function(){null===i._sequenceTypeSymbols&&(i._sequenceTypeSymbols=new lt("!&~$ "));var t=0,e=i.ParseCharactersFromCharSet(i._sequenceTypeSymbols);if(null===e)return null;var n,r=S(e);try{for(r.s();!(n=r.n()).done;){switch(n.value){case"!":t|=Dt.Once;break;case"&":t|=Dt.Cycle;break;case"~":t|=Dt.Shuffle;break;case"$":t|=Dt.Stopping;}}}catch(t){r.e(t);}finally{r.f();}return 0===t?null:t},i.SequenceTypeWordAnnotation=function(){var t=i.Interleave(i.SequenceTypeSingleWord,i.Exclude(i.Whitespace));if(null===t||0===t.length)return null;if(null===i.ParseString(":"))return null;var e,n=0,r=S(t);try{for(r.s();!(e=r.n()).done;){n|=e.value;}}catch(t){r.e(t);}finally{r.f();}return n},i.SequenceTypeSingleWord=function(){var t=null,e=i.Parse(i.IdentifierWithMetadata);if(null!==e)switch(e.name){case"once":t=Dt.Once;break;case"cycle":t=Dt.Cycle;break;case"shuffle":t=Dt.Shuffle;break;case"stopping":t=Dt.Stopping;}return null===t?null:t},i.InnerSequenceObjects=function(){return null!==i.Parse(i.Newline)?i.Parse(i.InnerMultilineSequenceObjects):i.Parse(i.InnerInlineSequenceObjects)},i.InnerInlineSequenceObjects=function(){var t=i.Interleave(i.Optional(i.MixedTextAndLogic),i.String("|"),null,!1);if(null===t)return null;var e,n=[],r=!1,a=S(t);try{for(a.s();!(e=a.n()).done;){var o=e.value;if("|"===o)r||n.push(new It),r=!1;else {var s=o;null===s?i.Error("Expected content, but got ".concat(o," (this is an ink compiler bug!)")):n.push(new It(s)),r=!0;}}}catch(t){a.e(t);}finally{a.f();}return r||n.push(new It),n},i.InnerMultilineSequenceObjects=function(){i.MultilineWhitespace();var t=i.OneOrMore(i.SingleMultilineSequenceElement);return null===t?null:t},i.SingleMultilineSequenceElement=function(){if(i.Whitespace(),null!==i.ParseString("->"))return null;if(null===i.ParseString("-"))return null;i.Whitespace();var t=i.StatementsAtLevel(Xt.InnerBlock);return null===t?i.MultilineWhitespace():t.unshift(new Et("\n")),new It(t)},i._statementRulesAtLevel=[],i._statementBreakRulesAtLevel=[],i.StatementsAtLevel=function(t){t===Xt.InnerBlock&&(null!==i.Parse(i.GatherDashes)&&i.Error("You can't use a gather (the dashes) within the { curly braces } context. For multi-line sequences and conditions, you should only use one dash."));return i.Interleave(i.Optional(i.MultilineWhitespace),(function(){return i.StatementAtLevel(t)}),(function(){return i.StatementsBreakForLevel(t)}))},i.StatementAtLevel=function(t){var e=i._statementRulesAtLevel[t],n=i.OneOf(e);return t===Xt.Top&&n instanceof Pt&&i.Error("should not have return statement outside of a knot"),n},i.StatementsBreakForLevel=function(t){i.Whitespace();var e=i._statementBreakRulesAtLevel[t],n=i.OneOf(e);return null===n?null:n},i.GenerateStatementLevelRules=function(){var t=Object.values(Xt);i._statementRulesAtLevel="f".repeat(t.length).split("f").map((function(){return []})),i._statementBreakRulesAtLevel="f".repeat(t.length).split("f").map((function(){return []}));for(var e=0,n=t;e<n.length;e++){var r=n[e],a=[],o=[];a.push(i.Line(i.MultiDivert)),r>=Xt.Top&&a.push(i.KnotDefinition),a.push(i.Line(i.Choice)),a.push(i.Line(i.AuthorWarning)),r>Xt.InnerBlock&&a.push(i.Gather),r>=Xt.Knot&&a.push(i.StitchDefinition),a.push(i.Line(i.ListDeclaration)),a.push(i.Line(i.VariableDeclaration)),a.push(i.Line(i.ConstDeclaration)),a.push(i.Line(i.ExternalDeclaration)),a.push(i.Line(i.IncludeStatement)),a.push(i.LogicLine),a.push(i.LineOfMixedTextAndLogic),r<=Xt.Knot&&o.push(i.KnotDeclaration),r<=Xt.Stitch&&o.push(i.StitchDeclaration),r<=Xt.InnerBlock&&(o.push(i.ParseDashNotArrow),o.push(i.String("}"))),i._statementRulesAtLevel[r]=a,i._statementBreakRulesAtLevel[r]=o;}},i.SkipToNextLine=function(){return i.ParseUntilCharactersFromString("\n\r"),i.ParseNewline(),Ct},i.Line=function(t){return function(){var e=i.ParseObject(t);return null===e?null:(i.Expect(i.EndOfLine,"end of line",i.SkipToNextLine),e)}},i._endOfTagCharSet=new lt("#\n\r\\"),i.Tag=function(){if(i.Whitespace(),null===i.ParseString("#"))return null;i.Whitespace();for(var t="";;){if(t+=i.ParseUntilCharactersFromCharSet(i._endOfTagCharSet)||"",null===i.ParseString("\\"))break;var e=i.ParseSingleCharacter();"\0"!==e&&(t+=e);}var n=t.trim();return new _e(new ce(n))},i.Tags=function(){var t=i.OneOrMore(i.Tag);return null===t?null:t},i._inlineWhitespaceChars=new lt(" \t"),i.EndOfLine=function(){return i.OneOf([i.Newline,i.EndOfFile])},i.Newline=function(){return i.Whitespace(),null!==i.ParseNewline()?Ct:null},i.EndOfFile=function(){return i.Whitespace(),i.endOfInput?Ct:null},i.MultilineWhitespace=function(){var t=i.OneOrMore(i.Newline);return null===t?null:t.length>=1?Ct:null},i.Whitespace=function(){return null!==i.ParseCharactersFromCharSet(i._inlineWhitespaceChars)?Ct:null},i.Spaced=function(t){return function(){i.Whitespace();var e=i.ParseObject(t);return null===e?null:(i.Whitespace(),e)}},i.AnyWhitespace=function(){for(var t=!1;null!==i.OneOf([i.Whitespace,i.MultilineWhitespace]);)t=!0;return t?Ct:null},i.MultiSpaced=function(t){return function(){i.AnyWhitespace();var e=i.ParseObject(t);return null===e?null:(i.AnyWhitespace(),e)}},i._filename=null,i._externalErrorHandler=null,i._fileHandler=null,i._filename=a,i.RegisterExpressionOperators(),i.GenerateStatementLevelRules(),i.errorHandler=i.OnStringParserError,i._externalErrorHandler=s,i._fileHandler=null===u?new Ae:u,null===l){if(i._rootParser=h(i),i._openFilenames=[],null!==i._filename){var c=i.fileHandler.ResolveInkFilename(i._filename);i._openFilenames.push(c);}}else i._rootParser=l;return i}return i(o,[{key:"fileHandler",get:function(){if(!this._fileHandler)throw new Error("No FileHandler defined");return this._fileHandler},set:function(t){this._fileHandler=t;}},{key:"PreProcessInputString",value:function(t){return new wt(t).Process()}},{key:"parsingStringExpression",get:function(){return this.GetFlag(Number(Gt.ParsingString))},set:function(t){this.SetFlag(Number(Gt.ParsingString),t);}},{key:"identifierCharSet",get:function(){return null===this._identifierCharSet&&((this._identifierCharSet=new lt).AddRange("A","Z").AddRange("a","z").AddRange("0","9").Add("_"),this.ExtendIdentifierCharacterRanges(this._identifierCharSet)),this._identifierCharSet}}]),o}(St);Te.LatinBasic=ut.Define("A","z",(new lt).AddRange("[","`")),Te.LatinExtendedA=ut.Define("Ā","ſ"),Te.LatinExtendedB=ut.Define("ƀ","ɏ"),Te.Greek=ut.Define("Ͱ","Ͽ",(new lt).AddRange("͸","΅").AddCharacters("ʹ͵͸·΋΍΢")),Te.Cyrillic=ut.Define("Ѐ","ӿ",(new lt).AddRange("҂","҉")),Te.Armenian=ut.Define("԰","֏",(new lt).AddCharacters("԰").AddRange("՗","ՠ").AddRange("ֈ","֎")),Te.Hebrew=ut.Define("֐","׿",new lt),Te.Arabic=ut.Define("؀","ۿ",new lt),Te.Korean=ut.Define("가","힯",new lt),Te.ListAllCharacterRanges=function(){return [Te.LatinBasic,Te.LatinExtendedA,Te.LatinExtendedB,Te.Arabic,Te.Armenian,Te.Cyrillic,Te.Greek,Te.Hebrew,Te.Korean]};var Pe=function(){function t(e){var r=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;n(this,t),this._errors=[],this._warnings=[],this._authorMessages=[],this._parsedStory=null,this._runtimeStory=null,this._parser=null,this._debugSourceRanges=[],this.Compile=function(){return r._parser=new Te(r.inputString,r.options.sourceFilename||null,r.OnError,null,r.options.fileHandler),r._parsedStory=r.parser.ParseStory(),0===r.errors.length?(r.parsedStory.countAllVisits=r.options.countAllVisits,r._runtimeStory=r.parsedStory.ExportRuntime(r.OnError)):r._runtimeStory=null,r.runtimeStory},this.RetrieveDebugSourceForLatestContent=function(){var t,e,n=S(r.runtimeStory.state.outputStream);try{for(n.s();!(e=n.n()).done;){var i=_(e.value,$);if(null!==i){var a=new k((null===(t=i.value)||void 0===t?void 0:t.length)||0,i.debugMetadata,i.value||"unknown");r.debugSourceRanges.push(a);}}}catch(t){n.e(t);}finally{n.f();}},this.DebugMetadataForContentAtOffset=function(t){var e,n=0,i=null,a=S(r.debugSourceRanges);try{for(a.s();!(e=a.n()).done;){var o=e.value;if(null!==o.debugMetadata&&(i=o.debugMetadata),t>=n&&t<n+o.length)return i;n+=o.length;}}catch(t){a.e(t);}finally{a.f();}return null},this.OnError=function(t,e){switch(e){case b.Author:r._authorMessages.push(t);break;case b.Warning:r._warnings.push(t);break;case b.Error:r._errors.push(t);}null!==r.options.errorHandler&&r.options.errorHandler(t,e);},this._inputString=e,this._options=i||new w;}return i(t,[{key:"errors",get:function(){return this._errors}},{key:"warnings",get:function(){return this._warnings}},{key:"authorMessages",get:function(){return this._authorMessages}},{key:"inputString",get:function(){return this._inputString}},{key:"options",get:function(){return this._options}},{key:"parsedStory",get:function(){if(!this._parsedStory)throw new Error;return this._parsedStory}},{key:"runtimeStory",get:function(){if(!this._runtimeStory)throw new Error("Compilation failed.");return this._runtimeStory}},{key:"parser",get:function(){if(!this._parser)throw new Error;return this._parser}},{key:"debugSourceRanges",get:function(){return this._debugSourceRanges}}]),t}();t.Compiler=Pe,t.CompilerOptions=w,t.InkList=B,Object.defineProperty(t,"__esModule",{value:!0});}));

    });

    var Ink = /*@__PURE__*/getDefaultExportFromCjs(inkFull);

    var storyJson = "﻿\"{\\\"inkVersion\\\":20,\\\"root\\\":[[\\\"^The year is 2050. You look outside your window and see...\\\",\\\"\\n\\\",[\\\"ev\\\",{\\\"^->\\\":\\\"0.2.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\"0.c-0\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^People wearing gasmasks, standing in line to get more food rations.\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],[\\\"ev\\\",{\\\"^->\\\":\\\"0.3.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\"0.c-1\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^Factories keeping the world together to sustain the consumerist lifestyles.\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],[\\\"ev\\\",{\\\"^->\\\":\\\"0.4.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\"0.c-2\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^A green oasis with children joyfully playing outside.\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],{\\\"c-0\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-0.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\"0.2.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",\\\"^You live in a world completely destroyed by a local factory. Your last food source has been destroyed by the pollution of this building. You have no other options for food anymore to survive.\\\",\\\"\\n\\\",\\\"^You have the option to destroy the factory to possibly save your the food source of your community. But this mean that the big part of the community will lose their job and bring possibly even more people hunger. If you can't create a new food source.\\\",\\\"\\n\\\",[[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-0.11.0.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-0\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^Don't destroy it.\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-0.11.1.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-1\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^Destroy it.\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],{\\\"c-0\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-0.11.c-0.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.0.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",\\\"^You didn't destroy the factory. Your neighbours and family ask, \\\\\"WHY DIDN'T YOU DESTROY THE FACTORY? NOW WE ARE SURLY DOOMED\\\\\".\\\",\\\"\\n\\\",[[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-0.11.c-0.9.0.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-0\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^It would have been a selfish act harming more people\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-0.11.c-0.9.1.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-1\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^I didn't know any better\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-0.11.c-0.9.2.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-2\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^Other\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],{\\\"c-0\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-0.11.c-0.9.c-0.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.0.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",{\\\"->\\\":\\\"factoryNotDestroyed\\\"},{\\\"->\\\":\\\"0.g-0\\\"},{\\\"#f\\\":5}],\\\"c-1\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-0.11.c-0.9.c-1.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.1.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",{\\\"->\\\":\\\"factoryNotDestroyed\\\"},{\\\"->\\\":\\\"0.g-0\\\"},{\\\"#f\\\":5}],\\\"c-2\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-0.11.c-0.9.c-2.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.2.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",{\\\"->\\\":\\\"factoryNotDestroyed\\\"},{\\\"->\\\":\\\"0.g-0\\\"},{\\\"#f\\\":5}]}],{\\\"#f\\\":5}],\\\"c-1\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-0.11.c-1.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.1.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",{\\\"->\\\":\\\"destroyFactory\\\"},{\\\"->\\\":\\\"0.g-0\\\"},{\\\"#f\\\":5}]}],{\\\"#f\\\":5}],\\\"c-1\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-1.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\"0.3.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",\\\"^You live in a world depended on local factories. You happen to work at one of these factories, which provides you with just enough income to live. However, your factory is a major pollutant for its environment and people living nearby are not able to grow any crops which is causing them to starve.\\\",\\\"\\n\\\",\\\"^You have the option to close the factory out of empathy for the neighboring community that are affected by the pollution. Or you can keep the factory open to keep supporting you own small community of factory workers.\\\",\\\"\\n\\\",[[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-1.11.0.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-0\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^Close it.\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-1.11.1.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-1\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^Keep it open.\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],{\\\"c-0\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-1.11.c-0.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.0.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",{\\\"->\\\":\\\"destroyFactory\\\"},{\\\"->\\\":\\\"0.g-0\\\"},{\\\"#f\\\":5}],\\\"c-1\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-1.11.c-1.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.1.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",{\\\"->\\\":\\\"keepFactoryOpen\\\"},{\\\"->\\\":\\\"0.g-0\\\"},{\\\"#f\\\":5}]}],{\\\"#f\\\":5}],\\\"c-2\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-2.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\"0.4.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",\\\"^You live in a world defined by luxury and pleasure, and you haven't experienced much difficulty in your life. You live in a paradise surrounded by walls, seperating you from other classes. Your pleasure comes at the cost of others and you have a lot of influence in deciding the future.\\\",\\\"\\n\\\",\\\"^You hear news of an investment opportunity that is coming up. You can invest in a factory of a lower class community, which could allow for their community to become more self-sustaining. Your other option is to invest more in upcoming fusion reactor developments, which could boost your own community's energy production exponentially.\\\",\\\"\\n\\\",[[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-2.11.0.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"str\\\",\\\"^in neighboring community\\\",\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-0\\\",\\\"flg\\\":22},{\\\"s\\\":[\\\"^Invest \\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-2.11.1.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"str\\\",\\\"^in our community\\\",\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-1\\\",\\\"flg\\\":22},{\\\"s\\\":[\\\"^Invest \\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],{\\\"c-0\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-2.11.c-0.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.0.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"^ in the neighboring lower class community.\\\",\\\"\\n\\\",{\\\"->\\\":\\\"investInFactory\\\"},{\\\"->\\\":\\\"0.g-0\\\"},{\\\"#f\\\":5}],\\\"c-1\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"0.c-2.11.c-1.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.1.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"^ in the upcoming fusion reactor developments. \\\",\\\"\\n\\\",{\\\"->\\\":\\\"investInCommunity\\\"},{\\\"->\\\":\\\"0.g-0\\\"},{\\\"#f\\\":5}]}],{\\\"#f\\\":5}],\\\"g-0\\\":[\\\"done\\\",{\\\"#f\\\":5}]}],\\\"done\\\",{\\\"factoryNotDestroyed\\\":[\\\"^Over the upcoming days you try to come up with different food sources. But nothing works. You desperately you move to the bigger city to try and ask them for help.\\\",\\\"\\n\\\",{\\\"->\\\":\\\"flee\\\"},{\\\"#f\\\":1}],\\\"destroyFactory\\\":[[\\\"^The factory is now gone. Now the world has less pollution and you might by able to create a new form of food and income for your community. However you now must provide for a lot more people who were depended on the factory. They are angry at you and demand an explanation and reasoning as to why you destroyed their lives.\\\",\\\"\\n\\\",[\\\"ev\\\",{\\\"^->\\\":\\\"destroyFactory.0.2.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-0\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^\\\\\"Sometimes you got to make sacrificies to make our world a better place.\\\\\"\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],[\\\"ev\\\",{\\\"^->\\\":\\\"destroyFactory.0.3.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-1\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^\\\\\"I had no choice! Otherwise, I had no food for myself and my community.\\\\\"\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],{\\\"c-0\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"destroyFactory.0.c-0.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.2.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",{\\\"->\\\":\\\"newLife\\\"},{\\\"#f\\\":5}],\\\"c-1\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"destroyFactory.0.c-1.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.3.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",{\\\"->\\\":\\\"newLife\\\"},{\\\"#f\\\":5}]}],{\\\"#f\\\":1}],\\\"keepFactoryOpen\\\":[[\\\"^You keep the factory open. You are still able to barely support your own community. But the land of your neighbors next to you is completely destroyed and they have nothing left. You know some of the people there and you get messages with the question of why you didn't close the factory\\\",\\\"\\n\\\",[\\\"ev\\\",{\\\"^->\\\":\\\"keepFactoryOpen.0.2.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-0\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^\\\\\"I have to support my own community first. I can't risk getting more people in trouble.\\\\\"\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],[\\\"ev\\\",{\\\"^->\\\":\\\"keepFactoryOpen.0.3.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-1\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^\\\\\"Otherwise these people will never learn how to be autonomous like us.\\\\\"\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],{\\\"c-0\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"keepFactoryOpen.0.c-0.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.2.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",{\\\"->\\\":\\\"promotion\\\"},{\\\"#f\\\":5}],\\\"c-1\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"keepFactoryOpen.0.c-1.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.3.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",{\\\"->\\\":\\\"promotion\\\"},{\\\"#f\\\":5}]}],{\\\"#f\\\":1}],\\\"promotion\\\":[[\\\"^Things are going well in the factory and you have been promoted to the executive board. There is a new budget and you get to decide how it should be spend. You have the option of helping out your neighbours by investing in soil fertility repairment, or you can upgrade the factory which would increase the production that could sustain the food needs of the whole community.\\\",\\\"\\n\\\",[\\\"ev\\\",{\\\"^->\\\":\\\"promotion.0.2.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-0\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^Invest in the soil fertility program.\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],[\\\"ev\\\",{\\\"^->\\\":\\\"promotion.0.3.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-1\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^Upgrade the production.\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],{\\\"c-0\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"promotion.0.c-0.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.2.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",{\\\"->\\\":\\\"rebuild\\\"},{\\\"#f\\\":5}],\\\"c-1\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"promotion.0.c-1.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.3.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",{\\\"->\\\":\\\"upgrade\\\"},{\\\"#f\\\":5}]}],{\\\"#f\\\":1}],\\\"newLife\\\":[\\\"^Over the upcoming days you try to come up with new food sources. You can stay with your community to try and improve your life there by slowly trying to rebuild food and production, with a possible chance of failure. Or you can move to the big city and try to rebuild your life there with your community. This requires everyone to abandon there lives.\\\",\\\"\\n\\\",[[\\\"ev\\\",{\\\"^->\\\":\\\"newLife.2.0.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-0\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^Rebuild from the ground up.\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],[\\\"ev\\\",{\\\"^->\\\":\\\"newLife.2.1.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-1\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^Seek a new life in the big city.\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],{\\\"c-0\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"newLife.2.c-0.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.0.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",{\\\"->\\\":\\\"rebuild\\\"},{\\\"#f\\\":5}],\\\"c-1\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"newLife.2.c-1.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.1.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",{\\\"->\\\":\\\"flee\\\"},{\\\"#f\\\":5}]}],{\\\"#f\\\":1}],\\\"investInCommunity\\\":[[\\\"^Your investment turned out to be a great succes, and the energy production of your community has sky rocketed. Some people are complaining though about the stench that is coming over the wall of your community. Some argue that an investment in the factory would have been a better option. Yet you argue that...\\\",\\\"\\n\\\",[\\\"ev\\\",{\\\"^->\\\":\\\"investInCommunity.0.2.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-0\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^\\\\\"Its better to fix your own problems first before you try to fix that of others.\\\\\"\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],[\\\"ev\\\",{\\\"^->\\\":\\\"investInCommunity.0.3.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-1\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^\\\\\"The other community needs to learn how to be autonomous, which they have to achieve without external aid.\\\\\"\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],{\\\"c-0\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"investInCommunity.0.c-0.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.2.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",{\\\"->\\\":\\\"utopia\\\"},{\\\"#f\\\":5}],\\\"c-1\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"investInCommunity.0.c-1.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.3.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",{\\\"->\\\":\\\"utopia\\\"},{\\\"#f\\\":5}]}],{\\\"#f\\\":1}],\\\"utopia\\\":[\\\"^You are able to maintain an utopian community. Chaos does seem to be present over the walls of your paradise, yet it doesn't really affect your quality of life. You and your peers have come to a consensus that these  external problems will have to be fixed by themselves, which is just a matter of time.\\\",\\\"\\n\\\",{\\\"->\\\":\\\"focusOnYourself\\\"},\\\"end\\\",{\\\"#f\\\":1}],\\\"investInFactory\\\":[[\\\"^You invest in the factory of the neighboring community. They are grateful for your help, Your own community is dissatisfied with your choice. You are wealthy but still have lots of other problems that require investing. They demand to know why you refuse to fix your own communities problems first.\\\",\\\"\\n\\\",[\\\"ev\\\",{\\\"^->\\\":\\\"investInFactory.0.2.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-0\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^\\\\\"We are wealthy enough the try and help others to achieve the same level of wealth. Maybe we can use them in the future to trade with.\\\\\"\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],[\\\"ev\\\",{\\\"^->\\\":\\\"investInFactory.0.3.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-1\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^\\\\\"We have to show good will to other from time to time. In the future we will focus more on our selves again.\\\\\"\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],{\\\"c-0\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"investInFactory.0.c-0.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.2.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",{\\\"->\\\":\\\"afterInvestingInFactory\\\"},{\\\"#f\\\":5}],\\\"c-1\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"investInFactory.0.c-1.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.3.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",{\\\"->\\\":\\\"afterInvestingInFactory\\\"},{\\\"#f\\\":5}]}],{\\\"#f\\\":1}],\\\"afterInvestingInFactory\\\":[[\\\"^After you invested you hear that the other community wants even more money and resources from you. They can't keep up them selves and need you to keep supporting them more and more. You realize they have become dependent on you. You can chose to keep investing in them or pull all the funds from them.\\\",\\\"\\n\\\",[\\\"ev\\\",{\\\"^->\\\":\\\"afterInvestingInFactory.0.2.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-0\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^Keep investing\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],[\\\"ev\\\",{\\\"^->\\\":\\\"afterInvestingInFactory.0.3.$r1\\\"},{\\\"temp=\\\":\\\"$r\\\"},\\\"str\\\",{\\\"->\\\":\\\".^.s\\\"},[{\\\"#n\\\":\\\"$r1\\\"}],\\\"\\/str\\\",\\\"\\/ev\\\",{\\\"*\\\":\\\".^.^.c-1\\\",\\\"flg\\\":18},{\\\"s\\\":[\\\"^Pull all funds\\\",{\\\"->\\\":\\\"$r\\\",\\\"var\\\":true},null]}],{\\\"c-0\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"afterInvestingInFactory.0.c-0.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.2.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",{\\\"->\\\":\\\"upgrade\\\"},{\\\"#f\\\":5}],\\\"c-1\\\":[\\\"ev\\\",{\\\"^->\\\":\\\"afterInvestingInFactory.0.c-1.$r2\\\"},\\\"\\/ev\\\",{\\\"temp=\\\":\\\"$r\\\"},{\\\"->\\\":\\\".^.^.3.s\\\"},[{\\\"#n\\\":\\\"$r2\\\"}],\\\"\\n\\\",{\\\"->\\\":\\\"focusOnYourself\\\"},{\\\"#f\\\":5}]}],{\\\"#f\\\":1}],\\\"flee\\\":[\\\"^When you arrive at the gates of the big cities, you must plead your case before the others will let you in. You have tried everything but it seems that the city has no place for you.\\\",\\\"\\n\\\",\\\"end\\\",{\\\"#f\\\":1}],\\\"rebuild\\\":[\\\"^You work hard to get your community to a better place. Your situation somewhat stabilizes more and your can support your own community a little bit better with improved living conditions and overall wealth. You are still not risk free. but you have learned that it is possible to improve a situation with a little investment. With this new perspective you decide to meet with the other leaders, to try and convince them that you could build a better world for all to live in.\\\",\\\"\\n\\\",\\\"end\\\",{\\\"#f\\\":1}],\\\"upgrade\\\":[\\\"^You invest again in the community. You see the effect your actions have on a lower community. It did however cost some of your own progress. But the world is a bit easier to live in for them. You decide to meet with the other community leaders to discuss your actions.\\\",\\\"\\n\\\",\\\"end\\\",{\\\"#f\\\":1}],\\\"focusOnYourself\\\":[\\\"^The other communities outside your city walls are destroyed. They were not able to sustain or rebuild themselves. They come knocking at your city walls asking for help. You don't know what decisions they have made that lead them to that situation. Maybe they destroyed themselves or maybe you caused their misfortune. But now a stream of refugees is headed towards your city.\\\",\\\"\\n\\\",\\\"end\\\",\\\"end\\\",{\\\"#f\\\":1}],\\\"#f\\\":1}],\\\"listDefs\\\":{}}\"";

    /* src\App.svelte generated by Svelte v3.50.1 */
    const file = "src\\App.svelte";

    // (83:2) {:else}
    function create_else_block(ctx) {
    	let h1;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Uh oh.";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Seems that something went wrong, please try to reload the page.";
    			attr_dev(h1, "class", "svelte-1lthp0g");
    			add_location(h1, file, 83, 4, 2504);
    			add_location(p, file, 84, 4, 2525);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(83:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (81:2) {#if participantLoaded}
    function create_if_block(ctx) {
    	let prompt;
    	let current;

    	prompt = new Prompt({
    			props: {
    				prompt: /*prompts*/ ctx[2][/*currentPrompt*/ ctx[1]],
    				opinions: /*testOpinions*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(prompt.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(prompt, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prompt.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prompt.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(prompt, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(81:2) {#if participantLoaded}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let script;
    	let script_src_value;
    	let t0;
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let t1;
    	let footer;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*participantLoaded*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			script = element("script");
    			t0 = space();
    			main = element("main");
    			if_block.c();
    			t1 = space();
    			create_component(footer.$$.fragment);
    			if (!src_url_equal(script.src, script_src_value = "https://data.id.tue.nl/api/v1/1335/anonymousParticipation.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file, 73, 2, 2230);
    			attr_dev(main, "class", "svelte-1lthp0g");
    			add_location(main, file, 79, 0, 2382);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			append_dev(main, t1);
    			mount_component(footer, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(script, "load", /*initializeParticipation*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, t1);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    			destroy_component(footer);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let currentPrompt = 1;

    	// let Story = new Ink.Story(storyJson);
    	const prompts = [
    		{
    			question: "The year is 2050. You look outside your window and see...",
    			answers: [
    				"People wearing gasmasks, standing in line to get more food rations.",
    				"Factories keeping the world together to sustain the consumerist lifestyles.",
    				"A green oasis with children joyfully playing outside."
    			],
    			canHaveOpinion: false
    		},
    		{
    			question: "You have the option to close the factory out of empathy for the neighboring community that are affected by the pollution. Or you can keep the factory open to keep supporting you own small community of factory workers.",
    			answers: ["Close it.", "Keep it open."],
    			canHaveOpinion: true
    		}
    	];

    	const testOpinions = [
    		{ answer: 0, text: "I don't think so." },
    		{ answer: 0, text: "That is weird." },
    		{ answer: 1, text: "Your opinion is wrong" },
    		{
    			answer: 1,
    			text: "That's a weird choice."
    		},
    		{
    			answer: 1,
    			text: "I make great pasta, so therefore the other answer is not ethical at all."
    		},
    		{
    			answer: 1,
    			text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id feugiat dolor. Aenean congue leo posuere, tincidunt nulla ut, imperdiet nibh. Nulla facilisi. Aliquam ut sem lectus. Mauris vitae urna lacinia, dapibus lectus nec, ullamcorper erat. Mauris ultrices eget erat vel dictum. Nulla at varius elit. Cras sed luctus neque."
    		}
    	];

    	let participantLoaded = false;

    	const initializeParticipation = () => {
    		if (DF !== undefined && DF.participant.id !== -1) {
    			$$invalidate(0, participantLoaded = true);
    		}

    		// TESTING
    		$$invalidate(0, participantLoaded = true);
    	}; // TESTING

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Prompt,
    		Intro,
    		Footer,
    		Ink,
    		OpinionCards,
    		storyJson,
    		currentPrompt,
    		prompts,
    		testOpinions,
    		participantLoaded,
    		initializeParticipation
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentPrompt' in $$props) $$invalidate(1, currentPrompt = $$props.currentPrompt);
    		if ('participantLoaded' in $$props) $$invalidate(0, participantLoaded = $$props.participantLoaded);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		participantLoaded,
    		currentPrompt,
    		prompts,
    		testOpinions,
    		initializeParticipation
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body
    });

    /** @type {import(types').DescendingSortFunction} */
    const descendingSortFunction = (firstElement, secondElement) =>
    	secondElement.text.length - firstElement.text.length;

    /** @type {import(types').GetLongestTextElement} */
    const getLongestTextElement = elements => {
    	const descendingTextLengthOrder = elements.sort(descendingSortFunction);
    	const longestTextElement = descendingTextLengthOrder[0].currentNode;
    	return longestTextElement
    };

    /** @type {import(types').Sleep} */
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    /** @type {import(types').RandomNumberGenerator} */
    const rng = (min, max) => Math.floor(Math.random() * (max - min) + min);

    /** @type {import(types').TypingInterval} */
    const typingInterval = async interval =>
    	sleep(Array.isArray(interval) ? interval[rng(0, interval.length)] : interval);

    const runOnEveryParentUntil = async (element, parent, callback) => {
    	if (!parent) {
    		console.error('The specified parent element does not exists!');
    		return
    	}

    	let currentElement = element;
    	do {
    		if (currentElement === parent) return

    		callback(currentElement);

    		currentElement = currentElement.parentElement || currentElement.parentNode;
    	} while (currentElement !== null && currentElement.nodeType === 1)
    };

    /** @type {import(types').TypewriterEffectFn} */
    const writeEffect = async ({ currentNode, text }, options) => {
    	runOnEveryParentUntil(currentNode, options.parentElement, element => {
    		const classToAdd = currentNode === element ? 'typing' : 'finished-typing';
    		element.classList.add(classToAdd);
    	});
    	for (let index = 0; index <= text.length; index++) {
    		const char = text[index];
    		char === '<' && (index = text.indexOf('>', index));
    		currentNode.innerHTML = text.slice(0, index);
    		await typingInterval(options.interval);
    	}
    };

    /** @type {import(types').OnAnimationEnd} */
    const onAnimationEnd = (element, callback) => {
    	const observer = new MutationObserver(mutations => {
    		mutations.forEach(mutation => {
    			const elementAttributeChanged = mutation.type === 'attributes';
    			const elementFinishedTyping = mutation.target.classList.contains('finished-typing');
    			if (elementAttributeChanged && elementFinishedTyping) callback();
    		});
    	});

    	observer.observe(element, {
    		attributes: true,
    		childList: true,
    		subtree: true
    	});
    };

    /** @type {import(types').HasSingleTextNode} */
    const hasSingleTextNode = el => el.childNodes.length === 1 && el.childNodes[0].nodeType === 3;

    /** @type {import(types').CreateElement} */
    const createElement = (text, elementTag) => {
    	const element = document.createElement(elementTag);
    	element.textContent = text;
    	return element
    };

    const filterOutStaticElements = child => child.dataset.static === undefined;

    /** @type {import(types').GetElements} */
    const getElements = (node, { parentElement }) => {
    	if (hasSingleTextNode(parentElement)) {
    		const text = parentElement.textContent;
    		const childNode = createElement(parentElement.textContent, 'p');
    		parentElement.textContent = '';
    		parentElement.appendChild(childNode);
    		return [{ currentNode: childNode, text }]
    	}

    	if (hasSingleTextNode(node)) {
    		const textWithFilteredAmpersand = node.innerHTML.replaceAll('&amp;', '&');
    		return [{ currentNode: node, text: textWithFilteredAmpersand }]
    	} else {
    		const children = [...node.children].filter(filterOutStaticElements);
    		const allChildren = children.flatMap(child => getElements(child, { parentElement }));
    		return allChildren
    	}
    };

    const makeNestedStaticElementsVisible = parentElement => {
    	const staticElements = [...parentElement.querySelectorAll('[data-static]')];
    	for (const staticElement of staticElements) {
    		runOnEveryParentUntil(staticElement, parentElement, currentStaticElement => {
    			const isParentElement = currentStaticElement !== staticElement;
    			isParentElement && currentStaticElement.classList.add('finished-typing');
    		});
    	}
    };

    const animationSetup = (node, props) => {
    	const dispatch = createEventDispatcher();
    	const options = { parentElement: node, dispatch, ...props };
    	const elements = getElements(node, options);

    	makeNestedStaticElementsVisible(node);

    	return { options, elements }
    };

    // the name "default" cannot be used due to being a js keyword
    const concurrent = (node, props) => {
    	const { options, elements } = animationSetup(node, props);

    	const lastElementToFinish = getLongestTextElement(elements);
    	onAnimationEnd(lastElementToFinish, () => options.dispatch('done'));

    	for (const element of elements) {
    		// "then" is required here to prevent blocking execution, thus keeping
    		// the animation asynchronous
    		writeEffect(element, options).then(() => {
    			if (options.keepCursorOnFinish) {
    				const isNotLongestElement = element.currentNode !== lastElementToFinish;
    				isNotLongestElement &&
    					element.currentNode.classList.replace('typing', 'finished-typing');
    			} else {
    				element.currentNode.classList.replace('typing', 'finished-typing');
    			}
    		});
    	}
    };

    var concurrent$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': concurrent
    });

    const cleanChildText = elements =>
    	elements.forEach(element => (element.currentNode.textContent = ''));

    const cascade = async (node, props) => {
    	const { options, elements } = animationSetup(node, props);

    	cleanChildText(elements);

    	for (const element of elements) {
    		await writeEffect(element, options);

    		if (options.keepCursorOnFinish) {
    			const isLastElement = elements.indexOf(element) === elements.length - 1;
    			!isLastElement && element.currentNode.classList.replace('typing', 'finished-typing');
    		} else {
    			element.currentNode.classList.replace('typing', 'finished-typing');
    		}
    	}

    	options.dispatch('done');
    };

    var cascade$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': cascade
    });

    /** @type {import(types').UnwriteEffect} */
    const unwriteEffect = async (currentNode, options) => {
    	const text = currentNode.innerHTML.replaceAll('&amp;', '&');
    	for (let index = text.length - 1; index >= 0; index--) {
    		const letter = text[index];
    		letter === '>' && (index = text.lastIndexOf('<', index));
    		currentNode.innerHTML = text.slice(0, index);
    		await typingInterval(options.unwriteInterval ? options.unwriteInterval : options.interval);
    	}
    };

    const writeAndUnwriteText = async ({ currentNode, text }, options) => {
    	await writeEffect({ currentNode, text }, options);
    	const textWithUnescapedAmpersands = text.replaceAll('&', '&amp;');

    	const fullyWritten = currentNode.innerHTML === textWithUnescapedAmpersands;

    	if (fullyWritten) {
    		options.dispatch('done');
    		await typingInterval(options.wordInterval);
    		await unwriteEffect(currentNode, options);
    	}

    	runOnEveryParentUntil(currentNode, options.parentElement, element => {
    		currentNode === element
    			? element.classList.remove('typing')
    			: element.classList.remove('finished-typing');
    	});
    };

    const loop = async (node, props) => {
    	const { options, elements } = animationSetup(node, props);

    	while (true) {
    		makeNestedStaticElementsVisible(node);
    		for (const element of elements) await writeAndUnwriteText(element, options);
    	}
    };

    var loop$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': loop
    });

    const loopOnce = async (node, props) => {
    	const { options, elements } = animationSetup(node, props);

    	for (const element of elements) {
    		const { currentNode, text } = element;

    		await writeEffect(element, options);
    		const textWithUnescapedAmpersands = text.replaceAll('&', '&amp;');

    		const fullyWritten = currentNode.innerHTML === textWithUnescapedAmpersands;

    		if (fullyWritten) {
    			options.dispatch('done');
    			await typingInterval(options.wordInterval);

    			const isLastElement = elements.indexOf(element) === elements.length - 1;

    			if (!isLastElement) {
    				await unwriteEffect(currentNode, options);
    				runOnEveryParentUntil(currentNode, options.parentElement, element => {
    					currentNode === element
    						? element.classList.remove('typing')
    						: element.classList.remove('finished-typing');
    				});
    			} else if (!options.keepCursorOnFinish) {
    				// by default, the cursor is kept when the animation is finished
    				// here we remove the cursor if "keepCursorOnFinish" is false
    				runOnEveryParentUntil(currentNode, options.parentElement, element => {
    					currentNode === element &&
    						element.classList.replace('typing', 'finished-typing');
    				});
    			}
    		}
    	}
    };

    var loopOnce$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': loopOnce
    });

    /** @type {any[]} */
    let alreadyChoosenTexts = [];

    /** @type {import(types').GetRandomText} */
    const getRandomElement = elements => {
    	while (true) {
    		const randomIndex = rng(0, elements.length);
    		// After each iteration, avoid repeating the last text from the last iteration
    		const isTextDifferentFromPrevious =
    			typeof alreadyChoosenTexts === 'number' && randomIndex !== alreadyChoosenTexts;
    		const isTextFirstTime =
    			Array.isArray(alreadyChoosenTexts) && !alreadyChoosenTexts.includes(randomIndex);
    		const hasSingleChildElement = elements.length === 1;
    		const shouldAnimate =
    			hasSingleChildElement || isTextFirstTime || isTextDifferentFromPrevious;
    		if (shouldAnimate) {
    			isTextDifferentFromPrevious && (alreadyChoosenTexts = []);
    			alreadyChoosenTexts.push(randomIndex);
    			const randomText = elements[randomIndex];
    			return randomText
    		}
    		const restartRandomizationCycle = alreadyChoosenTexts.length === elements.length;
    		restartRandomizationCycle && (alreadyChoosenTexts = alreadyChoosenTexts.pop());
    	}
    };

    const loopRandom = async (node, props) => {
    	const { options, elements } = animationSetup(node, props);

    	while (true) {
    		makeNestedStaticElementsVisible(node);
    		const element = getRandomElement(elements);
    		await writeAndUnwriteText(element, options);
    	}
    };

    var loopRandom$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': loopRandom
    });

    // returns a array with a timeout (in ms) for each letter of the word
    const getLettersTimeout = (textLetters, timeout) => {
    	const minimumTimeoutPossible = timeout / 3;
    	// TODO: find a better way to deal with this instead of explicitly reducing the maximum timeout
    	// otherwise, at the end of the animation, one or two characters remain scrambled
    	const lettersTimeout = textLetters.map(() => rng(minimumTimeoutPossible, timeout - 100));
    	return lettersTimeout
    };

    const getRandomLetter = () => {
    	const possibleLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split(
    		''
    	);
    	const letterIndexLimit = possibleLetters.length;
    	const randomLetterIndex = rng(0, letterIndexLimit);
    	const randomLetter = possibleLetters[randomLetterIndex];
    	return randomLetter
    };

    /** @type {TypewriterModeFn} */
    const scramble = async (node, props) => {
    	const { options, elements } = animationSetup(node, props);

    	const timeout = options.scrambleDuration;

    	await new Promise(resolve => {
    		elements.forEach(async ({ currentNode, text }) => {
    			let wordLetters = text.split('');
    			const lettersTimeout = getLettersTimeout(wordLetters, timeout);
    			const startingTime = Date.now();

    			runOnEveryParentUntil(currentNode, options.parentElement, element => {
    				element.classList.add('finished-typing');
    			});

    			while (Date.now() - startingTime < timeout) {
    				const randomLetterIndex = rng(0, wordLetters.length);
    				const randomLetterTimeout = lettersTimeout[randomLetterIndex];
    				const isRandomLetterWhitespace = wordLetters[randomLetterIndex] === ' ';
    				const timeEllapsed = () => Date.now() - startingTime;
    				const didRandomLetterReachTimeout = () => timeEllapsed() >= randomLetterTimeout;

    				if (didRandomLetterReachTimeout() || isRandomLetterWhitespace) {
    					const letterFinishedAnimation =
    						wordLetters[randomLetterIndex] === text[randomLetterIndex];

    					if (!letterFinishedAnimation)
    						wordLetters[randomLetterIndex] = text[randomLetterIndex];
    					else continue
    				} else {
    					wordLetters[randomLetterIndex] = getRandomLetter();
    				}

    				const scrambledText = wordLetters.join('');
    				currentNode.innerHTML = scrambledText;

    				const finishedScrambling = scrambledText === text;

    				const letterInterval = options.scrambleSlowdown
    					? Math.round(timeEllapsed() / 100)
    					: 1;

    				await sleep(letterInterval);

    				if (finishedScrambling) {
    					resolve();
    					break
    				}
    			}

    			currentNode.innerHTML = text;
    		});
    	});
    	options.dispatch('done');
    };

    var scramble$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': scramble
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
