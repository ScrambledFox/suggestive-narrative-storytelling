
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
    function create_if_block$4(ctx) {
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
    		id: create_if_block$4.name,
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
    	let if_block = /*index*/ ctx[5] > 0 && create_if_block$4(ctx);

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
    function create_if_block$3(ctx) {
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
    		id: create_if_block$3.name,
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
    	let if_block = /*button*/ ctx[1] !== "" && create_if_block$3(ctx);

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
    					if_block = create_if_block$3(ctx);
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
    function create_if_block$2(ctx) {
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
    		id: create_if_block$2.name,
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
    	const if_block_creators = [create_if_block$2, create_if_block_1$2, create_else_block$2];
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
    function create_if_block$1(ctx) {
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
    		id: create_if_block$1.name,
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
    	const if_block_creators = [create_if_block$1, create_else_block$1];
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

    // (22:2) {:else}
    function create_else_block(ctx) {
    	let typewriter;
    	let t0;
    	let t1;
    	let if_block1_anchor;
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
    	let if_block0 = /*answersVisible*/ ctx[2] && create_if_block_2(ctx);
    	let if_block1 = /*selected*/ ctx[3] !== -1 && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			create_component(typewriter.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(typewriter, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const typewriter_changes = {};

    			if (dirty & /*$$scope, prompt*/ 129) {
    				typewriter_changes.$$scope = { dirty, ctx };
    			}

    			typewriter.$set(typewriter_changes);

    			if (/*answersVisible*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*answersVisible*/ 4) {
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
    			transition_in(typewriter.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(typewriter.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(typewriter, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(22:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (20:2) {#if prompt.intro !== ""}
    function create_if_block(ctx) {
    	let intro;
    	let current;

    	intro = new Intro({
    			props: { text: /*prompt*/ ctx[0].intro },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(intro.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(intro, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const intro_changes = {};
    			if (dirty & /*prompt*/ 1) intro_changes.text = /*prompt*/ ctx[0].intro;
    			intro.$set(intro_changes);
    		},
    		i: function intro$1(local) {
    			if (current) return;
    			transition_in(intro.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(intro.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(intro, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(20:2) {#if prompt.intro !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (23:4) <Typewriter        mode="concurrent"        on:done={() => {          answersVisible = true;        }}      >
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
    		source: "(23:4) <Typewriter        mode=\\\"concurrent\\\"        on:done={() => {          answersVisible = true;        }}      >",
    		ctx
    	});

    	return block;
    }

    // (32:4) {#if answersVisible}
    function create_if_block_2(ctx) {
    	let answerlist;
    	let updating_selected;
    	let t;
    	let if_block_anchor;
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
    	let if_block = /*prompt*/ ctx[0].canHaveOpinion && create_if_block_3(ctx);

    	const block = {
    		c: function create() {
    			create_component(answerlist.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(answerlist, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
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
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*prompt*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
    			transition_in(answerlist.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(answerlist.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(answerlist, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(32:4) {#if answersVisible}",
    		ctx
    	});

    	return block;
    }

    // (35:6) {#if prompt.canHaveOpinion}
    function create_if_block_3(ctx) {
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
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(35:6) {#if prompt.canHaveOpinion}",
    		ctx
    	});

    	return block;
    }

    // (46:4) {#if selected !== -1}
    function create_if_block_1(ctx) {
    	let button;
    	let button_transition;
    	let current;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Choose ▶";
    			attr_dev(button, "class", "svelte-z6fwxr");
    			add_location(button, file$2, 46, 6, 1054);
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
    		source: "(46:4) {#if selected !== -1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let wrapper;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*prompt*/ ctx[0].intro !== "") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			wrapper = element("wrapper");
    			if_block.c();
    			attr_dev(wrapper, "class", "svelte-z6fwxr");
    			add_location(wrapper, file$2, 18, 0, 410);
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

    var name = "suggestive-storytelling";
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
    	name: name,
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

    var ink = createCommonjsModule(function (module, exports) {
    !function(t,e){e(exports);}(commonjsGlobal,(function(t){function e(t){return (e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}function r(t,e,n){return e&&i(t.prototype,e),n&&i(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function a(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&o(t,e);}function s(t){return (s=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function o(t,e){return (o=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function u(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}function l(t,e,n){return (l=u()?Reflect.construct:function(t,e,n){var i=[null];i.push.apply(i,e);var r=new(Function.bind.apply(t,i));return n&&o(r,n.prototype),r}).apply(null,arguments)}function h(t){var e="function"==typeof Map?new Map:void 0;return (h=function(t){if(null===t||(n=t,-1===Function.toString.call(n).indexOf("[native code]")))return t;var n;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,i);}function i(){return l(t,arguments,s(this).constructor)}return i.prototype=Object.create(t.prototype,{constructor:{value:i,enumerable:!1,writable:!0,configurable:!0}}),o(i,t)})(t)}function c(t,e){if(e&&("object"==typeof e||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function f(t){var e=u();return function(){var n,i=s(t);if(e){var r=s(this).constructor;n=Reflect.construct(i,arguments,r);}else n=i.apply(this,arguments);return c(this,n)}}function v(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null==n)return;var i,r,a=[],s=!0,o=!1;try{for(n=n.call(t);!(s=(i=n.next()).done)&&(a.push(i.value),!e||a.length!==e);s=!0);}catch(t){o=!0,r=t;}finally{try{s||null==n.return||n.return();}finally{if(o)throw r}}return a}(t,e)||p(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function d(t){return function(t){if(Array.isArray(t))return y(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||p(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(t,e){if(t){if("string"==typeof t)return y(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return "Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?y(t,e):void 0}}function y(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}function m(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=p(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var i=0,r=function(){};return {s:r,n:function(){return i>=t.length?{done:!0}:{done:!1,value:t[i++]}},e:function(t){throw t},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,s=!0,o=!1;return {s:function(){n=n.call(t);},n:function(){var t=n.next();return s=t.done,t},e:function(t){o=!0,a=t;},f:function(){try{s||null==n.return||n.return();}finally{if(o)throw a}}}}var g,S=function(){function t(){if(n(this,t),this._components=[],this._componentsString=null,this._isRelative=!1,"string"==typeof arguments[0]){var e=arguments[0];this.componentsString=e;}else if(arguments[0]instanceof t.Component&&arguments[1]instanceof t){var i=arguments[0],r=arguments[1];this._components.push(i),this._components=this._components.concat(r._components);}else if(arguments[0]instanceof Array){var a=arguments[0],s=!!arguments[1];this._components=this._components.concat(a),this._isRelative=s;}}return r(t,[{key:"isRelative",get:function(){return this._isRelative}},{key:"componentCount",get:function(){return this._components.length}},{key:"head",get:function(){return this._components.length>0?this._components[0]:null}},{key:"tail",get:function(){return this._components.length>=2?new t(this._components.slice(1,this._components.length)):t.self}},{key:"length",get:function(){return this._components.length}},{key:"lastComponent",get:function(){var t=this._components.length-1;return t>=0?this._components[t]:null}},{key:"containsNamedComponent",get:function(){for(var t=0,e=this._components.length;t<e;t++)if(!this._components[t].isIndex)return !0;return !1}},{key:"GetComponent",value:function(t){return this._components[t]}},{key:"PathByAppendingPath",value:function(e){for(var n=new t,i=0,r=0;r<e._components.length&&e._components[r].isParent;++r)i++;for(var a=0;a<this._components.length-i;++a)n._components.push(this._components[a]);for(var s=i;s<e._components.length;++s)n._components.push(e._components[s]);return n}},{key:"componentsString",get:function(){return null==this._componentsString&&(this._componentsString=this._components.join("."),this.isRelative&&(this._componentsString="."+this._componentsString)),this._componentsString},set:function(e){if(this._components.length=0,this._componentsString=e,null!=this._componentsString&&""!=this._componentsString){"."==this._componentsString[0]&&(this._isRelative=!0,this._componentsString=this._componentsString.substring(1));var n,i=m(this._componentsString.split("."));try{for(i.s();!(n=i.n()).done;){var r=n.value;/^(\-|\+)?([0-9]+|Infinity)$/.test(r)?this._components.push(new t.Component(parseInt(r))):this._components.push(new t.Component(r));}}catch(t){i.e(t);}finally{i.f();}}}},{key:"toString",value:function(){return this.componentsString}},{key:"Equals",value:function(t){if(null==t)return !1;if(t._components.length!=this._components.length)return !1;if(t.isRelative!=this.isRelative)return !1;for(var e=0,n=t._components.length;e<n;e++)if(!t._components[e].Equals(this._components[e]))return !1;return !0}},{key:"PathByAppendingComponent",value:function(e){var n,i=new t;return (n=i._components).push.apply(n,d(this._components)),i._components.push(e),i}}],[{key:"self",get:function(){var e=new t;return e._isRelative=!0,e}}]),t}();function k(t,e){return t instanceof e?T(t):null}function C(t,e){if(t instanceof e)return T(t);throw new Error("".concat(t," is not of type ").concat(e))}function b(t){return t.hasValidName&&t.name?t:null}function _(t){return void 0===t?null:t}function w(t){return "object"===e(t)&&"function"==typeof t.Equals}function T(t,e){return t}S.parentId="^",function(t){var e=function(){function e(t){n(this,e),this.index=-1,this.name=null,"string"==typeof t?this.name=t:this.index=t;}return r(e,[{key:"isIndex",get:function(){return this.index>=0}},{key:"isParent",get:function(){return this.name==t.parentId}},{key:"toString",value:function(){return this.isIndex?this.index.toString():this.name}},{key:"Equals",value:function(t){return null!=t&&t.isIndex==this.isIndex&&(this.isIndex?this.index==t.index:this.name==t.name)}}],[{key:"ToParent",value:function(){return new e(t.parentId)}}]),e}();t.Component=e;}(S||(S={})),function(t){function e(t,e){if(!t)throw void 0!==e&&console.warn(e),console.trace&&console.trace(),new Error("")}t.AssertType=function(t,n,i){e(t instanceof n,i);},t.Assert=e;}(g||(g={}));var E=function(t){a(i,t);var e=f(i);function i(){return n(this,i),e.apply(this,arguments)}return r(i)}(h(Error));function O(t){throw new E("".concat(t," is null or undefined"))}var P=function(){function t(){n(this,t),this.parent=null,this._debugMetadata=null,this._path=null;}return r(t,[{key:"debugMetadata",get:function(){return null===this._debugMetadata&&this.parent?this.parent.debugMetadata:this._debugMetadata},set:function(t){this._debugMetadata=t;}},{key:"ownDebugMetadata",get:function(){return this._debugMetadata}},{key:"DebugLineNumberOfPath",value:function(t){if(null===t)return null;var e=this.rootContentContainer;if(e){var n=e.ContentAtPath(t).obj;if(n){var i=n.debugMetadata;if(null!==i)return i.startLineNumber}}return null}},{key:"path",get:function(){if(null==this._path)if(null==this.parent)this._path=new S;else {for(var t=[],e=this,n=k(e.parent,q);null!==n;){var i=b(e);if(null!=i&&i.hasValidName){if(null===i.name)return O("namedChild.name");t.unshift(new S.Component(i.name));}else t.unshift(new S.Component(n.content.indexOf(e)));e=n,n=k(n.parent,q);}this._path=new S(t);}return this._path}},{key:"ResolvePath",value:function(t){if(null===t)return O("path");if(t.isRelative){var e=k(this,q);return null===e&&(g.Assert(null!==this.parent,"Can't resolve relative path because we don't have a parent"),e=k(this.parent,q),g.Assert(null!==e,"Expected parent to be a container"),g.Assert(t.GetComponent(0).isParent),t=t.tail),null===e?O("nearestContainer"):e.ContentAtPath(t)}var n=this.rootContentContainer;return null===n?O("contentContainer"):n.ContentAtPath(t)}},{key:"ConvertPathToRelative",value:function(t){for(var e=this.path,n=Math.min(t.length,e.length),i=-1,r=0;r<n;++r){var a=e.GetComponent(r),s=t.GetComponent(r);if(!a.Equals(s))break;i=r;}if(-1==i)return t;for(var o=e.componentCount-1-i,u=[],l=0;l<o;++l)u.push(S.Component.ToParent());for(var h=i+1;h<t.componentCount;++h)u.push(t.GetComponent(h));return new S(u,!0)}},{key:"CompactPathString",value:function(t){var e=null,n=null;t.isRelative?(n=t.componentsString,e=this.path.PathByAppendingPath(t).componentsString):(n=this.ConvertPathToRelative(t).componentsString,e=t.componentsString);return n.length<e.length?n:e}},{key:"rootContentContainer",get:function(){for(var t=this;t.parent;)t=t.parent;return k(t,q)}},{key:"Copy",value:function(){throw Error("Not Implemented: Doesn't support copying")}},{key:"SetChild",value:function(t,e,n){t[e]&&(t[e]=null),t[e]=n,t[e]&&(t[e].parent=this);}},{key:"Equals",value:function(t){return t===this}}]),t}(),N=function(){function t(e){n(this,t),e=void 0!==e?e.toString():"",this.string=e;}return r(t,[{key:"Length",get:function(){return this.string.length}},{key:"Append",value:function(t){null!==t&&(this.string+=t);}},{key:"AppendLine",value:function(t){void 0!==t&&this.Append(t),this.string+="\n";}},{key:"AppendFormat",value:function(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),i=1;i<e;i++)n[i-1]=arguments[i];this.string+=t.replace(/{(\d+)}/g,(function(t,e){return void 0!==n[e]?n[e]:t}));}},{key:"toString",value:function(){return this.string}}]),t}(),A=function(){function t(){if(n(this,t),this.originName=null,this.itemName=null,void 0!==arguments[1]){var e=arguments[0],i=arguments[1];this.originName=e,this.itemName=i;}else if(arguments[0]){var r=arguments[0],a=r.toString().split(".");this.originName=a[0],this.itemName=a[1];}}return r(t,[{key:"isNull",get:function(){return null==this.originName&&null==this.itemName}},{key:"fullName",get:function(){return (null!==this.originName?this.originName:"?")+"."+this.itemName}},{key:"toString",value:function(){return this.fullName}},{key:"Equals",value:function(e){if(e instanceof t){var n=e;return n.itemName==this.itemName&&n.originName==this.originName}return !1}},{key:"copy",value:function(){return new t(this.originName,this.itemName)}},{key:"serialized",value:function(){return JSON.stringify({originName:this.originName,itemName:this.itemName})}}],[{key:"Null",get:function(){return new t(null,null)}},{key:"fromSerializedKey",value:function(e){var n=JSON.parse(e);if(!t.isLikeInkListItem(n))return t.Null;var i=n;return new t(i.originName,i.itemName)}},{key:"isLikeInkListItem",value:function(t){return "object"===e(t)&&(!(!t.hasOwnProperty("originName")||!t.hasOwnProperty("itemName"))&&(("string"==typeof t.originName||null===typeof t.originName)&&("string"==typeof t.itemName||null===typeof t.itemName)))}}]),t}(),I=function(t){a(s,t);var i=f(s);function s(){var t,r=arguments;if(n(this,s),(t=i.call(this,r[0]instanceof s?r[0]:[])).origins=null,t._originNames=[],arguments[0]instanceof s){var a=arguments[0];t._originNames=a.originNames,null!==a.origins&&(t.origins=a.origins.slice());}else if("string"==typeof arguments[0]){var o=arguments[0],u=arguments[1];if(t.SetInitialOriginName(o),null===u.listDefinitions)return c(t,O("originStory.listDefinitions"));var l=u.listDefinitions.TryListGetDefinition(o,null);if(!l.exists)throw new Error("InkList origin could not be found in story when constructing new list: "+o);if(null===l.result)return c(t,O("def.result"));t.origins=[l.result];}else if("object"===e(arguments[0])&&arguments[0].hasOwnProperty("Key")&&arguments[0].hasOwnProperty("Value")){var h=arguments[0];t.Add(h.Key,h.Value);}return t}return r(s,[{key:"AddItem",value:function(t){if(t instanceof A){var e=t;if(null==e.originName)return void this.AddItem(e.itemName);if(null===this.origins)return O("this.origins");var n,i=m(this.origins);try{for(i.s();!(n=i.n()).done;){var r=n.value;if(r.name==e.originName){var a=r.TryGetValueForItem(e,0);if(a.exists)return void this.Add(e,a.result);throw new Error("Could not add the item "+e+" to this list because it doesn't exist in the original list definition in ink.")}}}catch(t){i.e(t);}finally{i.f();}throw new Error("Failed to add item to list because the item was from a new list definition that wasn't previously known to this list. Only items from previously known lists can be used, so that the int value can be found.")}var s=t,o=null;if(null===this.origins)return O("this.origins");var u,l=m(this.origins);try{for(l.s();!(u=l.n()).done;){var h=u.value;if(null===s)return O("itemName");if(h.ContainsItemWithName(s)){if(null!=o)throw new Error("Could not add the item "+s+" to this list because it could come from either "+h.name+" or "+o.name);o=h;}}}catch(t){l.e(t);}finally{l.f();}if(null==o)throw new Error("Could not add the item "+s+" to this list because it isn't known to any list definitions previously associated with this list.");var c=new A(o.name,s),f=o.ValueForItem(c);this.Add(c,f);}},{key:"ContainsItemNamed",value:function(t){var e,n=m(this);try{for(n.s();!(e=n.n()).done;){var i=v(e.value,1)[0];if(A.fromSerializedKey(i).itemName==t)return !0}}catch(t){n.e(t);}finally{n.f();}return !1}},{key:"ContainsKey",value:function(t){return this.has(t.serialized())}},{key:"Add",value:function(t,e){var n=t.serialized();if(this.has(n))throw new Error("The Map already contains an entry for ".concat(t));this.set(n,e);}},{key:"Remove",value:function(t){return this.delete(t.serialized())}},{key:"Count",get:function(){return this.size}},{key:"originOfMaxItem",get:function(){if(null==this.origins)return null;var t=this.maxItem.Key.originName,e=null;return this.origins.every((function(n){return n.name!=t||(e=n,!1)})),e}},{key:"originNames",get:function(){if(this.Count>0){null==this._originNames&&this.Count>0?this._originNames=[]:(this._originNames||(this._originNames=[]),this._originNames.length=0);var t,e=m(this);try{for(e.s();!(t=e.n()).done;){var n=v(t.value,1)[0],i=A.fromSerializedKey(n);if(null===i.originName)return O("item.originName");this._originNames.push(i.originName);}}catch(t){e.e(t);}finally{e.f();}}return this._originNames}},{key:"SetInitialOriginName",value:function(t){this._originNames=[t];}},{key:"SetInitialOriginNames",value:function(t){this._originNames=null==t?null:t.slice();}},{key:"maxItem",get:function(){var t,e={Key:A.Null,Value:0},n=m(this);try{for(n.s();!(t=n.n()).done;){var i=v(t.value,2),r=i[0],a=i[1],s=A.fromSerializedKey(r);(e.Key.isNull||a>e.Value)&&(e={Key:s,Value:a});}}catch(t){n.e(t);}finally{n.f();}return e}},{key:"minItem",get:function(){var t,e={Key:A.Null,Value:0},n=m(this);try{for(n.s();!(t=n.n()).done;){var i=v(t.value,2),r=i[0],a=i[1],s=A.fromSerializedKey(r);(e.Key.isNull||a<e.Value)&&(e={Key:s,Value:a});}}catch(t){n.e(t);}finally{n.f();}return e}},{key:"inverse",get:function(){var t=new s;if(null!=this.origins){var e,n=m(this.origins);try{for(n.s();!(e=n.n()).done;){var i,r=m(e.value.items);try{for(r.s();!(i=r.n()).done;){var a=v(i.value,2),o=a[0],u=a[1],l=A.fromSerializedKey(o);this.ContainsKey(l)||t.Add(l,u);}}catch(t){r.e(t);}finally{r.f();}}}catch(t){n.e(t);}finally{n.f();}}return t}},{key:"all",get:function(){var t=new s;if(null!=this.origins){var e,n=m(this.origins);try{for(n.s();!(e=n.n()).done;){var i,r=m(e.value.items);try{for(r.s();!(i=r.n()).done;){var a=v(i.value,2),o=a[0],u=a[1],l=A.fromSerializedKey(o);t.set(l.serialized(),u);}}catch(t){r.e(t);}finally{r.f();}}}catch(t){n.e(t);}finally{n.f();}}return t}},{key:"Union",value:function(t){var e,n=new s(this),i=m(t);try{for(i.s();!(e=i.n()).done;){var r=v(e.value,2),a=r[0],o=r[1];n.set(a,o);}}catch(t){i.e(t);}finally{i.f();}return n}},{key:"Intersect",value:function(t){var e,n=new s,i=m(this);try{for(i.s();!(e=i.n()).done;){var r=v(e.value,2),a=r[0],o=r[1];t.has(a)&&n.set(a,o);}}catch(t){i.e(t);}finally{i.f();}return n}},{key:"Without",value:function(t){var e,n=new s(this),i=m(t);try{for(i.s();!(e=i.n()).done;){var r=v(e.value,1)[0];n.delete(r);}}catch(t){i.e(t);}finally{i.f();}return n}},{key:"Contains",value:function(t){var e,n=m(t);try{for(n.s();!(e=n.n()).done;){var i=v(e.value,1)[0];if(!this.has(i))return !1}}catch(t){n.e(t);}finally{n.f();}return !0}},{key:"GreaterThan",value:function(t){return 0!=this.Count&&(0==t.Count||this.minItem.Value>t.maxItem.Value)}},{key:"GreaterThanOrEquals",value:function(t){return 0!=this.Count&&(0==t.Count||this.minItem.Value>=t.minItem.Value&&this.maxItem.Value>=t.maxItem.Value)}},{key:"LessThan",value:function(t){return 0!=t.Count&&(0==this.Count||this.maxItem.Value<t.minItem.Value)}},{key:"LessThanOrEquals",value:function(t){return 0!=t.Count&&(0==this.Count||this.maxItem.Value<=t.maxItem.Value&&this.minItem.Value<=t.minItem.Value)}},{key:"MaxAsList",value:function(){return this.Count>0?new s(this.maxItem):new s}},{key:"MinAsList",value:function(){return this.Count>0?new s(this.minItem):new s}},{key:"ListWithSubRange",value:function(t,e){if(0==this.Count)return new s;var n=this.orderedItems,i=0,r=Number.MAX_SAFE_INTEGER;Number.isInteger(t)?i=t:t instanceof s&&t.Count>0&&(i=t.minItem.Value),Number.isInteger(e)?r=e:t instanceof s&&t.Count>0&&(r=e.maxItem.Value);var a=new s;a.SetInitialOriginNames(this.originNames);var o,u=m(n);try{for(u.s();!(o=u.n()).done;){var l=o.value;l.Value>=i&&l.Value<=r&&a.Add(l.Key,l.Value);}}catch(t){u.e(t);}finally{u.f();}return a}},{key:"Equals",value:function(t){if(t instanceof s==!1)return !1;if(t.Count!=this.Count)return !1;var e,n=m(this);try{for(n.s();!(e=n.n()).done;){var i=v(e.value,1)[0];if(!t.has(i))return !1}}catch(t){n.e(t);}finally{n.f();}return !0}},{key:"orderedItems",get:function(){var t,e=new Array,n=m(this);try{for(n.s();!(t=n.n()).done;){var i=v(t.value,2),r=i[0],a=i[1],s=A.fromSerializedKey(r);e.push({Key:s,Value:a});}}catch(t){n.e(t);}finally{n.f();}return e.sort((function(t,e){return null===t.Key.originName?O("x.Key.originName"):null===e.Key.originName?O("y.Key.originName"):t.Value==e.Value?t.Key.originName.localeCompare(e.Key.originName):t.Value<e.Value?-1:t.Value>e.Value?1:0})),e}},{key:"toString",value:function(){for(var t=this.orderedItems,e=new N,n=0;n<t.length;n++){n>0&&e.Append(", ");var i=t[n].Key;if(null===i.itemName)return O("item.itemName");e.Append(i.itemName);}return e.toString()}},{key:"valueOf",value:function(){return NaN}}],[{key:"FromString",value:function(t,e){var n,i=null===(n=e.listDefinitions)||void 0===n?void 0:n.FindSingleItemListWithName(t);if(i)return null===i.value?O("listValue.value"):new s(i.value);throw new Error("Could not find the InkListItem from the string '"+t+"' to create an InkList because it doesn't exist in the original list definition in ink.")}}]),s}(h(Map)),x=function(t){a(i,t);var e=f(i);function i(t){var r;return n(this,i),(r=e.call(this,t)).useEndLineNumber=!1,r.message=t,r.name="StoryException",r}return r(i)}(h(Error));function F(t,e,n){if(null===t)return {result:n,exists:!1};var i=t.get(e);return void 0===i?{result:n,exists:!1}:{result:i,exists:!0}}var W,V=function(t){a(i,t);var e=f(i);function i(t){var r;return n(this,i),(r=e.call(this)).value=t,r}return r(i,[{key:"valueObject",get:function(){return this.value}},{key:"toString",value:function(){return null===this.value?O("Value.value"):this.value.toString()}}]),i}(function(t){a(i,t);var e=f(i);function i(){return n(this,i),e.apply(this,arguments)}return r(i,[{key:"Copy",value:function(){return C(i.Create(this.valueObject),P)}},{key:"BadCastException",value:function(t){return new x("Can't cast "+this.valueObject+" from "+this.valueType+" to "+t)}}],[{key:"Create",value:function(t,e){if(e){if(e===W.Int&&Number.isInteger(Number(t)))return new R(Number(t));if(e===W.Float&&!isNaN(t))return new j(Number(t))}return "boolean"==typeof t?new L(Boolean(t)):"string"==typeof t?new D(String(t)):Number.isInteger(Number(t))?new R(Number(t)):isNaN(t)?t instanceof S?new B(C(t,S)):t instanceof I?new M(C(t,I)):null:new j(Number(t))}}]),i}(P)),L=function(t){a(i,t);var e=f(i);function i(t){return n(this,i),e.call(this,t||!1)}return r(i,[{key:"isTruthy",get:function(){return Boolean(this.value)}},{key:"valueType",get:function(){return W.Bool}},{key:"Cast",value:function(t){if(null===this.value)return O("Value.value");if(t==this.valueType)return this;if(t==W.Int)return new R(this.value?1:0);if(t==W.Float)return new j(this.value?1:0);if(t==W.String)return new D(this.value?"true":"false");throw this.BadCastException(t)}},{key:"toString",value:function(){return this.value?"true":"false"}}]),i}(V),R=function(t){a(i,t);var e=f(i);function i(t){return n(this,i),e.call(this,t||0)}return r(i,[{key:"isTruthy",get:function(){return 0!=this.value}},{key:"valueType",get:function(){return W.Int}},{key:"Cast",value:function(t){if(null===this.value)return O("Value.value");if(t==this.valueType)return this;if(t==W.Bool)return new L(0!==this.value);if(t==W.Float)return new j(this.value);if(t==W.String)return new D(""+this.value);throw this.BadCastException(t)}}]),i}(V),j=function(t){a(i,t);var e=f(i);function i(t){return n(this,i),e.call(this,t||0)}return r(i,[{key:"isTruthy",get:function(){return 0!=this.value}},{key:"valueType",get:function(){return W.Float}},{key:"Cast",value:function(t){if(null===this.value)return O("Value.value");if(t==this.valueType)return this;if(t==W.Bool)return new L(0!==this.value);if(t==W.Int)return new R(this.value);if(t==W.String)return new D(""+this.value);throw this.BadCastException(t)}}]),i}(V),D=function(t){a(i,t);var e=f(i);function i(t){var r;return n(this,i),(r=e.call(this,t||""))._isNewline="\n"==r.value,r._isInlineWhitespace=!0,null===r.value?c(r,O("Value.value")):(r.value.length>0&&r.value.split("").every((function(t){return " "==t||"\t"==t||(r._isInlineWhitespace=!1,!1)})),r)}return r(i,[{key:"valueType",get:function(){return W.String}},{key:"isTruthy",get:function(){return null===this.value?O("Value.value"):this.value.length>0}},{key:"isNewline",get:function(){return this._isNewline}},{key:"isInlineWhitespace",get:function(){return this._isInlineWhitespace}},{key:"isNonWhitespace",get:function(){return !this.isNewline&&!this.isInlineWhitespace}},{key:"Cast",value:function(t){if(t==this.valueType)return this;if(t==W.Int){var e=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=parseInt(t);return Number.isNaN(n)?{result:e,exists:!1}:{result:n,exists:!0}}(this.value);if(e.exists)return new R(e.result);throw this.BadCastException(t)}if(t==W.Float){var n=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=parseFloat(t);return Number.isNaN(n)?{result:e,exists:!1}:{result:n,exists:!0}}(this.value);if(n.exists)return new j(n.result);throw this.BadCastException(t)}throw this.BadCastException(t)}}]),i}(V),B=function(t){a(i,t);var e=f(i);function i(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;return n(this,i),e.call(this,t)}return r(i,[{key:"valueType",get:function(){return W.DivertTarget}},{key:"targetPath",get:function(){return null===this.value?O("Value.value"):this.value},set:function(t){this.value=t;}},{key:"isTruthy",get:function(){throw new Error("Shouldn't be checking the truthiness of a divert target")}},{key:"Cast",value:function(t){if(t==this.valueType)return this;throw this.BadCastException(t)}},{key:"toString",value:function(){return "DivertTargetValue("+this.targetPath+")"}}]),i}(V),G=function(t){a(i,t);var e=f(i);function i(t){var r,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1;return n(this,i),(r=e.call(this,t))._contextIndex=a,r}return r(i,[{key:"contextIndex",get:function(){return this._contextIndex},set:function(t){this._contextIndex=t;}},{key:"variableName",get:function(){return null===this.value?O("Value.value"):this.value},set:function(t){this.value=t;}},{key:"valueType",get:function(){return W.VariablePointer}},{key:"isTruthy",get:function(){throw new Error("Shouldn't be checking the truthiness of a variable pointer")}},{key:"Cast",value:function(t){if(t==this.valueType)return this;throw this.BadCastException(t)}},{key:"toString",value:function(){return "VariablePointerValue("+this.variableName+")"}},{key:"Copy",value:function(){return new i(this.variableName,this.contextIndex)}}]),i}(V),M=function(t){a(i,t);var e=f(i);function i(t,r){var a;return n(this,i),a=e.call(this,null),t||r?t instanceof I?a.value=new I(t):t instanceof A&&"number"==typeof r&&(a.value=new I({Key:t,Value:r})):a.value=new I,a}return r(i,[{key:"isTruthy",get:function(){return null===this.value?O("this.value"):this.value.Count>0}},{key:"valueType",get:function(){return W.List}},{key:"Cast",value:function(t){if(null===this.value)return O("Value.value");if(t==W.Int){var e=this.value.maxItem;return e.Key.isNull?new R(0):new R(e.Value)}if(t==W.Float){var n=this.value.maxItem;return n.Key.isNull?new j(0):new j(n.Value)}if(t==W.String){var i=this.value.maxItem;return i.Key.isNull?new D(""):new D(i.Key.toString())}if(t==this.valueType)return this;throw this.BadCastException(t)}}],[{key:"RetainListOriginsForAssignment",value:function(t,e){var n=k(t,i),r=k(e,i);return r&&null===r.value?O("newList.value"):n&&null===n.value?O("oldList.value"):void(n&&r&&0==r.value.Count&&r.value.SetInitialOriginNames(n.value.originNames))}}]),i}(V);!function(t){t[t.Bool=-1]="Bool",t[t.Int=0]="Int",t[t.Float=1]="Float",t[t.List=2]="List",t[t.String=3]="String",t[t.DivertTarget=4]="DivertTarget",t[t.VariablePointer=5]="VariablePointer";}(W||(W={}));var J=function(){function t(){n(this,t),this.obj=null,this.approximate=!1;}return r(t,[{key:"correctObj",get:function(){return this.approximate?null:this.obj}},{key:"container",get:function(){return this.obj instanceof q?this.obj:null}},{key:"copy",value:function(){var e=new t;return e.obj=this.obj,e.approximate=this.approximate,e}}]),t}(),q=function(t){a(i,t);var e=f(i);function i(){var t;return n(this,i),(t=e.apply(this,arguments)).name=null,t._content=[],t.namedContent=new Map,t.visitsShouldBeCounted=!1,t.turnIndexShouldBeCounted=!1,t.countingAtStartOnly=!1,t._pathToFirstLeafContent=null,t}return r(i,[{key:"hasValidName",get:function(){return null!=this.name&&this.name.length>0}},{key:"content",get:function(){return this._content},set:function(t){this.AddContent(t);}},{key:"namedOnlyContent",get:function(){var t,e=new Map,n=m(this.namedContent);try{for(n.s();!(t=n.n()).done;){var i=v(t.value,2),r=i[0],a=C(i[1],P);e.set(r,a);}}catch(t){n.e(t);}finally{n.f();}var s,o=m(this.content);try{for(o.s();!(s=o.n()).done;){var u=b(s.value);null!=u&&u.hasValidName&&e.delete(u.name);}}catch(t){o.e(t);}finally{o.f();}return 0==e.size&&(e=null),e},set:function(t){var e=this.namedOnlyContent;if(null!=e){var n,i=m(e);try{for(i.s();!(n=i.n()).done;){var r=v(n.value,1)[0];this.namedContent.delete(r);}}catch(t){i.e(t);}finally{i.f();}}if(null!=t){var a,s=m(t);try{for(s.s();!(a=s.n()).done;){var o=b(v(a.value,2)[1]);null!=o&&this.AddToNamedContentOnly(o);}}catch(t){s.e(t);}finally{s.f();}}}},{key:"countFlags",get:function(){var t=0;return this.visitsShouldBeCounted&&(t|=i.CountFlags.Visits),this.turnIndexShouldBeCounted&&(t|=i.CountFlags.Turns),this.countingAtStartOnly&&(t|=i.CountFlags.CountStartOnly),t==i.CountFlags.CountStartOnly&&(t=0),t},set:function(t){var e=t;(e&i.CountFlags.Visits)>0&&(this.visitsShouldBeCounted=!0),(e&i.CountFlags.Turns)>0&&(this.turnIndexShouldBeCounted=!0),(e&i.CountFlags.CountStartOnly)>0&&(this.countingAtStartOnly=!0);}},{key:"pathToFirstLeafContent",get:function(){return null==this._pathToFirstLeafContent&&(this._pathToFirstLeafContent=this.path.PathByAppendingPath(this.internalPathToFirstLeafContent)),this._pathToFirstLeafContent}},{key:"internalPathToFirstLeafContent",get:function(){for(var t=[],e=this;e instanceof i;)e.content.length>0&&(t.push(new S.Component(0)),e=e.content[0]);return new S(t)}},{key:"AddContent",value:function(t){if(t instanceof Array){var e,n=m(t);try{for(n.s();!(e=n.n()).done;){var i=e.value;this.AddContent(i);}}catch(t){n.e(t);}finally{n.f();}}else {var r=t;if(this._content.push(r),r.parent)throw new Error("content is already in "+r.parent);r.parent=this,this.TryAddNamedContent(r);}}},{key:"TryAddNamedContent",value:function(t){var e=b(t);null!=e&&e.hasValidName&&this.AddToNamedContentOnly(e);}},{key:"AddToNamedContentOnly",value:function(t){if(g.AssertType(t,P,"Can only add Runtime.Objects to a Runtime.Container"),C(t,P).parent=this,null===t.name)return O("namedContentObj.name");this.namedContent.set(t.name,t);}},{key:"ContentAtPath",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:-1;-1==n&&(n=t.length);var r=new J;r.approximate=!1;for(var a=this,s=this,o=e;o<n;++o){var u=t.GetComponent(o);if(null==a){r.approximate=!0;break}var l=a.ContentWithPathComponent(u);if(null==l){r.approximate=!0;break}s=l,a=k(l,i);}return r.obj=s,r}},{key:"InsertContent",value:function(t,e){if(this.content.splice(e,0,t),t.parent)throw new Error("content is already in "+t.parent);t.parent=this,this.TryAddNamedContent(t);}},{key:"AddContentsOfContainer",value:function(t){var e;(e=this.content).push.apply(e,d(t.content));var n,i=m(t.content);try{for(i.s();!(n=i.n()).done;){var r=n.value;r.parent=this,this.TryAddNamedContent(r);}}catch(t){i.e(t);}finally{i.f();}}},{key:"ContentWithPathComponent",value:function(t){if(t.isIndex)return t.index>=0&&t.index<this.content.length?this.content[t.index]:null;if(t.isParent)return this.parent;if(null===t.name)return O("component.name");var e=F(this.namedContent,t.name,null);return e.exists?C(e.result,P):null}},{key:"BuildStringOfHierarchy",value:function(){var t;if(0==arguments.length)return t=new N,this.BuildStringOfHierarchy(t,0,null),t.toString();t=arguments[0];var e=arguments[1],n=arguments[2];function r(){for(var n=0;n<4*e;++n)t.Append(" ");}r(),t.Append("["),this.hasValidName&&t.AppendFormat(" ({0})",this.name),this==n&&t.Append("  <---"),t.AppendLine(),e++;for(var a=0;a<this.content.length;++a){var s=this.content[a];if(s instanceof i){var o=s;o.BuildStringOfHierarchy(t,e,n);}else r(),s instanceof D?(t.Append('"'),t.Append(s.toString().replace("\n","\\n")),t.Append('"')):t.Append(s.toString());a!=this.content.length-1&&t.Append(","),s instanceof i||s!=n||t.Append("  <---"),t.AppendLine();}var u,l=new Map,h=m(this.namedContent);try{for(h.s();!(u=h.n()).done;){var c=v(u.value,2),f=c[0],d=c[1];this.content.indexOf(C(d,P))>=0||l.set(f,d);}}catch(t){h.e(t);}finally{h.f();}if(l.size>0){r(),t.AppendLine("-- named: --");var p,y=m(l);try{for(y.s();!(p=y.n()).done;){var S=v(p.value,2),k=S[1];g.AssertType(k,i,"Can only print out named Containers");var b=k;b.BuildStringOfHierarchy(t,e,n),t.AppendLine();}}catch(t){y.e(t);}finally{y.f();}}e--,r(),t.Append("]");}}]),i}(P);!function(t){var e;(e=t.CountFlags||(t.CountFlags={}))[e.Visits=1]="Visits",e[e.Turns=2]="Turns",e[e.CountStartOnly=4]="CountStartOnly";}(q||(q={}));var U,K=function(t){a(i,t);var e=f(i);function i(){return n(this,i),e.apply(this,arguments)}return r(i,[{key:"toString",value:function(){return "Glue"}}]),i}(P),z=function(t){a(i,t);var e=f(i);function i(){var t,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:i.CommandType.NotSet;return n(this,i),(t=e.call(this))._commandType=r,t}return r(i,[{key:"commandType",get:function(){return this._commandType}},{key:"Copy",value:function(){return new i(this.commandType)}},{key:"toString",value:function(){return this.commandType.toString()}}],[{key:"EvalStart",value:function(){return new i(i.CommandType.EvalStart)}},{key:"EvalOutput",value:function(){return new i(i.CommandType.EvalOutput)}},{key:"EvalEnd",value:function(){return new i(i.CommandType.EvalEnd)}},{key:"Duplicate",value:function(){return new i(i.CommandType.Duplicate)}},{key:"PopEvaluatedValue",value:function(){return new i(i.CommandType.PopEvaluatedValue)}},{key:"PopFunction",value:function(){return new i(i.CommandType.PopFunction)}},{key:"PopTunnel",value:function(){return new i(i.CommandType.PopTunnel)}},{key:"BeginString",value:function(){return new i(i.CommandType.BeginString)}},{key:"EndString",value:function(){return new i(i.CommandType.EndString)}},{key:"NoOp",value:function(){return new i(i.CommandType.NoOp)}},{key:"ChoiceCount",value:function(){return new i(i.CommandType.ChoiceCount)}},{key:"Turns",value:function(){return new i(i.CommandType.Turns)}},{key:"TurnsSince",value:function(){return new i(i.CommandType.TurnsSince)}},{key:"ReadCount",value:function(){return new i(i.CommandType.ReadCount)}},{key:"Random",value:function(){return new i(i.CommandType.Random)}},{key:"SeedRandom",value:function(){return new i(i.CommandType.SeedRandom)}},{key:"VisitIndex",value:function(){return new i(i.CommandType.VisitIndex)}},{key:"SequenceShuffleIndex",value:function(){return new i(i.CommandType.SequenceShuffleIndex)}},{key:"StartThread",value:function(){return new i(i.CommandType.StartThread)}},{key:"Done",value:function(){return new i(i.CommandType.Done)}},{key:"End",value:function(){return new i(i.CommandType.End)}},{key:"ListFromInt",value:function(){return new i(i.CommandType.ListFromInt)}},{key:"ListRange",value:function(){return new i(i.CommandType.ListRange)}},{key:"ListRandom",value:function(){return new i(i.CommandType.ListRandom)}}]),i}(P);!function(t){var e;(e=t.CommandType||(t.CommandType={}))[e.NotSet=-1]="NotSet",e[e.EvalStart=0]="EvalStart",e[e.EvalOutput=1]="EvalOutput",e[e.EvalEnd=2]="EvalEnd",e[e.Duplicate=3]="Duplicate",e[e.PopEvaluatedValue=4]="PopEvaluatedValue",e[e.PopFunction=5]="PopFunction",e[e.PopTunnel=6]="PopTunnel",e[e.BeginString=7]="BeginString",e[e.EndString=8]="EndString",e[e.NoOp=9]="NoOp",e[e.ChoiceCount=10]="ChoiceCount",e[e.Turns=11]="Turns",e[e.TurnsSince=12]="TurnsSince",e[e.Random=13]="Random",e[e.SeedRandom=14]="SeedRandom",e[e.VisitIndex=15]="VisitIndex",e[e.SequenceShuffleIndex=16]="SequenceShuffleIndex",e[e.StartThread=17]="StartThread",e[e.Done=18]="Done",e[e.End=19]="End",e[e.ListFromInt=20]="ListFromInt",e[e.ListRange=21]="ListRange",e[e.ListRandom=22]="ListRandom",e[e.ReadCount=23]="ReadCount",e[e.TOTAL_VALUES=24]="TOTAL_VALUES";}(z||(z={})),function(t){t[t.Tunnel=0]="Tunnel",t[t.Function=1]="Function",t[t.FunctionEvaluationFromGame=2]="FunctionEvaluationFromGame";}(U||(U={}));var H=function(){function t(){n(this,t),this.container=null,this.index=-1,2===arguments.length&&(this.container=arguments[0],this.index=arguments[1]);}return r(t,[{key:"Resolve",value:function(){return this.index<0?this.container:null==this.container?null:0==this.container.content.length?this.container:this.index>=this.container.content.length?null:this.container.content[this.index]}},{key:"isNull",get:function(){return null==this.container}},{key:"path",get:function(){return this.isNull?null:this.index>=0?this.container.path.PathByAppendingComponent(new S.Component(this.index)):this.container.path}},{key:"toString",value:function(){return this.container?"Ink Pointer -> "+this.container.path.toString()+" -- index "+this.index:"Ink Pointer (null)"}},{key:"copy",value:function(){return new t(this.container,this.index)}}],[{key:"StartOf",value:function(e){return new t(e,0)}},{key:"Null",get:function(){return new t(null,-1)}}]),t}(),X=function(t){a(i,t);var e=f(i);function i(t){var r;return n(this,i),(r=e.call(this))._targetPath=null,r._targetPointer=H.Null,r.variableDivertName=null,r.pushesToStack=!1,r.stackPushType=0,r.isExternal=!1,r.externalArgs=0,r.isConditional=!1,r.pushesToStack=!1,void 0!==t&&(r.pushesToStack=!0,r.stackPushType=t),r}return r(i,[{key:"targetPath",get:function(){if(null!=this._targetPath&&this._targetPath.isRelative){var t=this.targetPointer.Resolve();t&&(this._targetPath=t.path);}return this._targetPath},set:function(t){this._targetPath=t,this._targetPointer=H.Null;}},{key:"targetPointer",get:function(){if(this._targetPointer.isNull){var t=this.ResolvePath(this._targetPath).obj;if(null===this._targetPath)return O("this._targetPath");if(null===this._targetPath.lastComponent)return O("this._targetPath.lastComponent");if(this._targetPath.lastComponent.isIndex){if(null===t)return O("targetObj");this._targetPointer.container=t.parent instanceof q?t.parent:null,this._targetPointer.index=this._targetPath.lastComponent.index;}else this._targetPointer=H.StartOf(t instanceof q?t:null);}return this._targetPointer.copy()}},{key:"targetPathString",get:function(){return null==this.targetPath?null:this.CompactPathString(this.targetPath)},set:function(t){this.targetPath=null==t?null:new S(t);}},{key:"hasVariableTarget",get:function(){return null!=this.variableDivertName}},{key:"Equals",value:function(t){var e=t;return e instanceof i&&this.hasVariableTarget==e.hasVariableTarget&&(this.hasVariableTarget?this.variableDivertName==e.variableDivertName:null===this.targetPath?O("this.targetPath"):this.targetPath.Equals(e.targetPath))}},{key:"toString",value:function(){if(this.hasVariableTarget)return "Divert(variable: "+this.variableDivertName+")";if(null==this.targetPath)return "Divert(null)";var t=new N,e=this.targetPath.toString();return t.Append("Divert"),this.isConditional&&t.Append("?"),this.pushesToStack&&(this.stackPushType==U.Function?t.Append(" function"):t.Append(" tunnel")),t.Append(" -> "),t.Append(this.targetPathString),t.Append(" ("),t.Append(e),t.Append(")"),t.toString()}}]),i}(P),$=function(t){a(i,t);var e=f(i);function i(){var t,r=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];return n(this,i),(t=e.call(this))._pathOnChoice=null,t.hasCondition=!1,t.hasStartContent=!1,t.hasChoiceOnlyContent=!1,t.isInvisibleDefault=!1,t.onceOnly=!0,t.onceOnly=r,t}return r(i,[{key:"pathOnChoice",get:function(){if(null!=this._pathOnChoice&&this._pathOnChoice.isRelative){var t=this.choiceTarget;t&&(this._pathOnChoice=t.path);}return this._pathOnChoice},set:function(t){this._pathOnChoice=t;}},{key:"choiceTarget",get:function(){return null===this._pathOnChoice?O("ChoicePoint._pathOnChoice"):this.ResolvePath(this._pathOnChoice).container}},{key:"pathStringOnChoice",get:function(){return null===this.pathOnChoice?O("ChoicePoint.pathOnChoice"):this.CompactPathString(this.pathOnChoice)},set:function(t){this.pathOnChoice=new S(t);}},{key:"flags",get:function(){var t=0;return this.hasCondition&&(t|=1),this.hasStartContent&&(t|=2),this.hasChoiceOnlyContent&&(t|=4),this.isInvisibleDefault&&(t|=8),this.onceOnly&&(t|=16),t},set:function(t){this.hasCondition=(1&t)>0,this.hasStartContent=(2&t)>0,this.hasChoiceOnlyContent=(4&t)>0,this.isInvisibleDefault=(8&t)>0,this.onceOnly=(16&t)>0;}},{key:"toString",value:function(){return null===this.pathOnChoice?O("ChoicePoint.pathOnChoice"):"Choice: -> "+this.pathOnChoice.toString()}}]),i}(P),Y=function(t){a(i,t);var e=f(i);function i(){var t,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;return n(this,i),(t=e.call(this)).pathForCount=null,t.name=r,t}return r(i,[{key:"containerForCount",get:function(){return null===this.pathForCount?null:this.ResolvePath(this.pathForCount).container}},{key:"pathStringForCount",get:function(){return null===this.pathForCount?null:this.CompactPathString(this.pathForCount)},set:function(t){this.pathForCount=null===t?null:new S(t);}},{key:"toString",value:function(){return null!=this.name?"var("+this.name+")":"read_count("+this.pathStringForCount+")"}}]),i}(P),Q=function(t){a(i,t);var e=f(i);function i(t,r){var a;return n(this,i),(a=e.call(this)).variableName=t||null,a.isNewDeclaration=!!r,a.isGlobal=!1,a}return r(i,[{key:"toString",value:function(){return "VarAssign to "+this.variableName}}]),i}(P),Z=function(t){a(i,t);var e=f(i);function i(){return n(this,i),e.apply(this,arguments)}return r(i)}(P),tt=function(t){a(i,t);var e=f(i);function i(){var t;if(n(this,i),(t=e.call(this))._name=null,t._numberOfParameters=0,t._prototype=null,t._isPrototype=!1,t._operationFuncs=null,0===arguments.length)i.GenerateNativeFunctionsIfNecessary();else if(1===arguments.length){var r=arguments[0];i.GenerateNativeFunctionsIfNecessary(),t.name=r;}else if(2===arguments.length){var a=arguments[0],s=arguments[1];t._isPrototype=!0,t.name=a,t.numberOfParameters=s;}return t}return r(i,[{key:"name",get:function(){return null===this._name?O("NativeFunctionCall._name"):this._name},set:function(t){this._name=t,this._isPrototype||(null===i._nativeFunctions?O("NativeFunctionCall._nativeFunctions"):this._prototype=i._nativeFunctions.get(this._name)||null);}},{key:"numberOfParameters",get:function(){return this._prototype?this._prototype.numberOfParameters:this._numberOfParameters},set:function(t){this._numberOfParameters=t;}},{key:"Call",value:function(t){if(this._prototype)return this._prototype.Call(t);if(this.numberOfParameters!=t.length)throw new Error("Unexpected number of parameters");var e,n=!1,i=m(t);try{for(i.s();!(e=i.n()).done;){var r=e.value;if(r instanceof Z)throw new x('Attempting to perform operation on a void value. Did you forget to "return" a value from a function you called here?');r instanceof M&&(n=!0);}}catch(t){i.e(t);}finally{i.f();}if(2==t.length&&n)return this.CallBinaryListOperation(t);var a=this.CoerceValuesToSingleType(t),s=a[0].valueType;return s==W.Int||s==W.Float||s==W.String||s==W.DivertTarget||s==W.List?this.CallType(a):null}},{key:"CallType",value:function(t){var e=C(t[0],V),n=e.valueType,r=e,a=t.length;if(2==a||1==a){if(null===this._operationFuncs)return O("NativeFunctionCall._operationFuncs");var s=this._operationFuncs.get(n);if(!s){var o=W[n];throw new x("Cannot perform operation "+this.name+" on "+o)}if(2==a){var u=C(t[1],V),l=s;if(null===r.value||null===u.value)return O("NativeFunctionCall.Call BinaryOp values");var h=l(r.value,u.value);return V.Create(h)}var c=s;if(null===r.value)return O("NativeFunctionCall.Call UnaryOp value");var f=c(r.value);return this.name===i.Int?V.Create(f,W.Int):this.name===i.Float?V.Create(f,W.Float):V.Create(f,e.valueType)}throw new Error("Unexpected number of parameters to NativeFunctionCall: "+t.length)}},{key:"CallBinaryListOperation",value:function(t){if(("+"==this.name||"-"==this.name)&&t[0]instanceof M&&t[1]instanceof R)return this.CallListIncrementOperation(t);var e=C(t[0],V),n=C(t[1],V);if(!("&&"!=this.name&&"||"!=this.name||e.valueType==W.List&&n.valueType==W.List)){if(null===this._operationFuncs)return O("NativeFunctionCall._operationFuncs");var i=this._operationFuncs.get(W.Int);if(null===i)return O("NativeFunctionCall.CallBinaryListOperation op");var r=function(t){if("boolean"==typeof t)return t;throw new Error("".concat(t," is not a boolean"))}(i(e.isTruthy?1:0,n.isTruthy?1:0));return new L(r)}if(e.valueType==W.List&&n.valueType==W.List)return this.CallType([e,n]);throw new x("Can not call use "+this.name+" operation on "+W[e.valueType]+" and "+W[n.valueType])}},{key:"CallListIncrementOperation",value:function(t){var e=C(t[0],M),n=C(t[1],R),i=new I;if(null===e.value)return O("NativeFunctionCall.CallListIncrementOperation listVal.value");var r,a=m(e.value);try{for(a.s();!(r=a.n()).done;){var s=v(r.value,2),o=s[0],u=s[1],l=A.fromSerializedKey(o);if(null===this._operationFuncs)return O("NativeFunctionCall._operationFuncs");var h=this._operationFuncs.get(W.Int);if(null===n.value)return O("NativeFunctionCall.CallListIncrementOperation intVal.value");var c=h(u,n.value),f=null;if(null===e.value.origins)return O("NativeFunctionCall.CallListIncrementOperation listVal.value.origins");var d,p=m(e.value.origins);try{for(p.s();!(d=p.n()).done;){var y=d.value;if(y.name==l.originName){f=y;break}}}catch(t){p.e(t);}finally{p.f();}if(null!=f){var g=f.TryGetItemWithValue(c,A.Null);g.exists&&i.Add(g.result,c);}}}catch(t){a.e(t);}finally{a.f();}return new M(i)}},{key:"CoerceValuesToSingleType",value:function(t){var e,n=W.Int,i=null,r=m(t);try{for(r.s();!(e=r.n()).done;){var a=C(e.value,V);a.valueType>n&&(n=a.valueType),a.valueType==W.List&&(i=k(a,M));}}catch(t){r.e(t);}finally{r.f();}var s=[];if(W[n]==W[W.List]){var o,u=m(t);try{for(u.s();!(o=u.n()).done;){var l=C(o.value,V);if(l.valueType==W.List)s.push(l);else {if(l.valueType!=W.Int){var h=W[l.valueType];throw new x("Cannot mix Lists and "+h+" values in this operation")}var c=parseInt(l.valueObject);if(null===(i=C(i,M)).value)return O("NativeFunctionCall.CoerceValuesToSingleType specialCaseList.value");var f=i.value.originOfMaxItem;if(null===f)return O("NativeFunctionCall.CoerceValuesToSingleType list");var v=f.TryGetItemWithValue(c,A.Null);if(!v.exists)throw new x("Could not find List item with the value "+c+" in "+f.name);var d=new M(v.result,c);s.push(d);}}}catch(t){u.e(t);}finally{u.f();}}else {var p,y=m(t);try{for(y.s();!(p=y.n()).done;){var g=C(p.value,V).Cast(n);s.push(g);}}catch(t){y.e(t);}finally{y.f();}}return s}},{key:"AddOpFuncForType",value:function(t,e){null==this._operationFuncs&&(this._operationFuncs=new Map),this._operationFuncs.set(t,e);}},{key:"toString",value:function(){return 'Native "'+this.name+'"'}}],[{key:"CallWithName",value:function(t){return new i(t)}},{key:"CallExistsWithName",value:function(t){return this.GenerateNativeFunctionsIfNecessary(),this._nativeFunctions.get(t)}},{key:"Identity",value:function(t){return t}},{key:"GenerateNativeFunctionsIfNecessary",value:function(){if(null==this._nativeFunctions){this._nativeFunctions=new Map,this.AddIntBinaryOp(this.Add,(function(t,e){return t+e})),this.AddIntBinaryOp(this.Subtract,(function(t,e){return t-e})),this.AddIntBinaryOp(this.Multiply,(function(t,e){return t*e})),this.AddIntBinaryOp(this.Divide,(function(t,e){return Math.floor(t/e)})),this.AddIntBinaryOp(this.Mod,(function(t,e){return t%e})),this.AddIntUnaryOp(this.Negate,(function(t){return -t})),this.AddIntBinaryOp(this.Equal,(function(t,e){return t==e})),this.AddIntBinaryOp(this.Greater,(function(t,e){return t>e})),this.AddIntBinaryOp(this.Less,(function(t,e){return t<e})),this.AddIntBinaryOp(this.GreaterThanOrEquals,(function(t,e){return t>=e})),this.AddIntBinaryOp(this.LessThanOrEquals,(function(t,e){return t<=e})),this.AddIntBinaryOp(this.NotEquals,(function(t,e){return t!=e})),this.AddIntUnaryOp(this.Not,(function(t){return 0==t})),this.AddIntBinaryOp(this.And,(function(t,e){return 0!=t&&0!=e})),this.AddIntBinaryOp(this.Or,(function(t,e){return 0!=t||0!=e})),this.AddIntBinaryOp(this.Max,(function(t,e){return Math.max(t,e)})),this.AddIntBinaryOp(this.Min,(function(t,e){return Math.min(t,e)})),this.AddIntBinaryOp(this.Pow,(function(t,e){return Math.pow(t,e)})),this.AddIntUnaryOp(this.Floor,i.Identity),this.AddIntUnaryOp(this.Ceiling,i.Identity),this.AddIntUnaryOp(this.Int,i.Identity),this.AddIntUnaryOp(this.Float,(function(t){return t})),this.AddFloatBinaryOp(this.Add,(function(t,e){return t+e})),this.AddFloatBinaryOp(this.Subtract,(function(t,e){return t-e})),this.AddFloatBinaryOp(this.Multiply,(function(t,e){return t*e})),this.AddFloatBinaryOp(this.Divide,(function(t,e){return t/e})),this.AddFloatBinaryOp(this.Mod,(function(t,e){return t%e})),this.AddFloatUnaryOp(this.Negate,(function(t){return -t})),this.AddFloatBinaryOp(this.Equal,(function(t,e){return t==e})),this.AddFloatBinaryOp(this.Greater,(function(t,e){return t>e})),this.AddFloatBinaryOp(this.Less,(function(t,e){return t<e})),this.AddFloatBinaryOp(this.GreaterThanOrEquals,(function(t,e){return t>=e})),this.AddFloatBinaryOp(this.LessThanOrEquals,(function(t,e){return t<=e})),this.AddFloatBinaryOp(this.NotEquals,(function(t,e){return t!=e})),this.AddFloatUnaryOp(this.Not,(function(t){return 0==t})),this.AddFloatBinaryOp(this.And,(function(t,e){return 0!=t&&0!=e})),this.AddFloatBinaryOp(this.Or,(function(t,e){return 0!=t||0!=e})),this.AddFloatBinaryOp(this.Max,(function(t,e){return Math.max(t,e)})),this.AddFloatBinaryOp(this.Min,(function(t,e){return Math.min(t,e)})),this.AddFloatBinaryOp(this.Pow,(function(t,e){return Math.pow(t,e)})),this.AddFloatUnaryOp(this.Floor,(function(t){return Math.floor(t)})),this.AddFloatUnaryOp(this.Ceiling,(function(t){return Math.ceil(t)})),this.AddFloatUnaryOp(this.Int,(function(t){return Math.floor(t)})),this.AddFloatUnaryOp(this.Float,i.Identity),this.AddStringBinaryOp(this.Add,(function(t,e){return t+e})),this.AddStringBinaryOp(this.Equal,(function(t,e){return t===e})),this.AddStringBinaryOp(this.NotEquals,(function(t,e){return !(t===e)})),this.AddStringBinaryOp(this.Has,(function(t,e){return t.includes(e)})),this.AddStringBinaryOp(this.Hasnt,(function(t,e){return !t.includes(e)})),this.AddListBinaryOp(this.Add,(function(t,e){return t.Union(e)})),this.AddListBinaryOp(this.Subtract,(function(t,e){return t.Without(e)})),this.AddListBinaryOp(this.Has,(function(t,e){return t.Contains(e)})),this.AddListBinaryOp(this.Hasnt,(function(t,e){return !t.Contains(e)})),this.AddListBinaryOp(this.Intersect,(function(t,e){return t.Intersect(e)})),this.AddListBinaryOp(this.Equal,(function(t,e){return t.Equals(e)})),this.AddListBinaryOp(this.Greater,(function(t,e){return t.GreaterThan(e)})),this.AddListBinaryOp(this.Less,(function(t,e){return t.LessThan(e)})),this.AddListBinaryOp(this.GreaterThanOrEquals,(function(t,e){return t.GreaterThanOrEquals(e)})),this.AddListBinaryOp(this.LessThanOrEquals,(function(t,e){return t.LessThanOrEquals(e)})),this.AddListBinaryOp(this.NotEquals,(function(t,e){return !t.Equals(e)})),this.AddListBinaryOp(this.And,(function(t,e){return t.Count>0&&e.Count>0})),this.AddListBinaryOp(this.Or,(function(t,e){return t.Count>0||e.Count>0})),this.AddListUnaryOp(this.Not,(function(t){return 0==t.Count?1:0})),this.AddListUnaryOp(this.Invert,(function(t){return t.inverse})),this.AddListUnaryOp(this.All,(function(t){return t.all})),this.AddListUnaryOp(this.ListMin,(function(t){return t.MinAsList()})),this.AddListUnaryOp(this.ListMax,(function(t){return t.MaxAsList()})),this.AddListUnaryOp(this.Count,(function(t){return t.Count})),this.AddListUnaryOp(this.ValueOfList,(function(t){return t.maxItem.Value}));this.AddOpToNativeFunc(this.Equal,2,W.DivertTarget,(function(t,e){return t.Equals(e)})),this.AddOpToNativeFunc(this.NotEquals,2,W.DivertTarget,(function(t,e){return !t.Equals(e)}));}}},{key:"AddOpToNativeFunc",value:function(t,e,n,r){if(null===this._nativeFunctions)return O("NativeFunctionCall._nativeFunctions");var a=this._nativeFunctions.get(t);a||(a=new i(t,e),this._nativeFunctions.set(t,a)),a.AddOpFuncForType(n,r);}},{key:"AddIntBinaryOp",value:function(t,e){this.AddOpToNativeFunc(t,2,W.Int,e);}},{key:"AddIntUnaryOp",value:function(t,e){this.AddOpToNativeFunc(t,1,W.Int,e);}},{key:"AddFloatBinaryOp",value:function(t,e){this.AddOpToNativeFunc(t,2,W.Float,e);}},{key:"AddFloatUnaryOp",value:function(t,e){this.AddOpToNativeFunc(t,1,W.Float,e);}},{key:"AddStringBinaryOp",value:function(t,e){this.AddOpToNativeFunc(t,2,W.String,e);}},{key:"AddListBinaryOp",value:function(t,e){this.AddOpToNativeFunc(t,2,W.List,e);}},{key:"AddListUnaryOp",value:function(t,e){this.AddOpToNativeFunc(t,1,W.List,e);}}]),i}(P);tt.Add="+",tt.Subtract="-",tt.Divide="/",tt.Multiply="*",tt.Mod="%",tt.Negate="_",tt.Equal="==",tt.Greater=">",tt.Less="<",tt.GreaterThanOrEquals=">=",tt.LessThanOrEquals="<=",tt.NotEquals="!=",tt.Not="!",tt.And="&&",tt.Or="||",tt.Min="MIN",tt.Max="MAX",tt.Pow="POW",tt.Floor="FLOOR",tt.Ceiling="CEILING",tt.Int="INT",tt.Float="FLOAT",tt.Has="?",tt.Hasnt="!?",tt.Intersect="^",tt.ListMin="LIST_MIN",tt.ListMax="LIST_MAX",tt.All="LIST_ALL",tt.Count="LIST_COUNT",tt.ValueOfList="LIST_VALUE",tt.Invert="LIST_INVERT",tt._nativeFunctions=null;var et=function(t){a(i,t);var e=f(i);function i(t){var r;return n(this,i),(r=e.call(this)).text=t.toString()||"",r}return r(i,[{key:"toString",value:function(){return "# "+this.text}}]),i}(P),nt=function(t){a(i,t);var e=f(i);function i(){var t;return n(this,i),(t=e.apply(this,arguments)).text="",t.index=0,t.threadAtGeneration=null,t.sourcePath="",t.targetPath=null,t.isInvisibleDefault=!1,t.originalThreadIndex=0,t}return r(i,[{key:"pathStringOnChoice",get:function(){return null===this.targetPath?O("Choice.targetPath"):this.targetPath.toString()},set:function(t){this.targetPath=new S(t);}}]),i}(P),it=function(){function t(e,i){n(this,t),this._name=e||"",this._items=null,this._itemNameToValues=i||new Map;}return r(t,[{key:"name",get:function(){return this._name}},{key:"items",get:function(){if(null==this._items){this._items=new Map;var t,e=m(this._itemNameToValues);try{for(e.s();!(t=e.n()).done;){var n=v(t.value,2),i=n[0],r=n[1],a=new A(this.name,i);this._items.set(a.serialized(),r);}}catch(t){e.e(t);}finally{e.f();}}return this._items}},{key:"ValueForItem",value:function(t){if(!t.itemName)return 0;var e=this._itemNameToValues.get(t.itemName);return void 0!==e?e:0}},{key:"ContainsItem",value:function(t){return !!t.itemName&&(t.originName==this.name&&this._itemNameToValues.has(t.itemName))}},{key:"ContainsItemWithName",value:function(t){return this._itemNameToValues.has(t)}},{key:"TryGetItemWithValue",value:function(t,e){var n,i=m(this._itemNameToValues);try{for(i.s();!(n=i.n()).done;){var r=v(n.value,2),a=r[0];if(r[1]==t)return {result:new A(this.name,a),exists:!0}}}catch(t){i.e(t);}finally{i.f();}return {result:A.Null,exists:!1}}},{key:"TryGetValueForItem",value:function(t,e){if(!t.itemName)return {result:0,exists:!1};var n=this._itemNameToValues.get(t.itemName);return n?{result:n,exists:!0}:{result:0,exists:!1}}}]),t}(),rt=function(){function t(e){n(this,t),this._lists=new Map,this._allUnambiguousListValueCache=new Map;var i,r=m(e);try{for(r.s();!(i=r.n()).done;){var a=i.value;this._lists.set(a.name,a);var s,o=m(a.items);try{for(o.s();!(s=o.n()).done;){var u=v(s.value,2),l=u[0],h=u[1],c=A.fromSerializedKey(l),f=new M(c,h);if(!c.itemName)throw new Error("item.itemName is null or undefined.");this._allUnambiguousListValueCache.set(c.itemName,f),this._allUnambiguousListValueCache.set(c.fullName,f);}}catch(t){o.e(t);}finally{o.f();}}}catch(t){r.e(t);}finally{r.f();}}return r(t,[{key:"lists",get:function(){var t,e=[],n=m(this._lists);try{for(n.s();!(t=n.n()).done;){var i=v(t.value,2)[1];e.push(i);}}catch(t){n.e(t);}finally{n.f();}return e}},{key:"TryListGetDefinition",value:function(t,e){if(null===t)return {result:e,exists:!1};var n=this._lists.get(t);return n?{result:n,exists:!0}:{result:e,exists:!1}}},{key:"FindSingleItemListWithName",value:function(t){if(null===t)return O("name");var e=this._allUnambiguousListValueCache.get(t);return void 0!==e?e:null}}]),t}(),at=function(){function t(){n(this,t);}return r(t,null,[{key:"JArrayToRuntimeObjList",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=t.length;e&&n--;for(var i=[],r=0;r<n;r++){var a=t[r],s=this.JTokenToRuntimeObject(a);if(null===s)return O("runtimeObj");i.push(s);}return i}},{key:"WriteDictionaryRuntimeObjs",value:function(t,e){t.WriteObjectStart();var n,i=m(e);try{for(i.s();!(n=i.n()).done;){var r=v(n.value,2),a=r[0],s=r[1];t.WritePropertyStart(a),this.WriteRuntimeObject(t,s),t.WritePropertyEnd();}}catch(t){i.e(t);}finally{i.f();}t.WriteObjectEnd();}},{key:"WriteListRuntimeObjs",value:function(t,e){t.WriteArrayStart();var n,i=m(e);try{for(i.s();!(n=i.n()).done;){var r=n.value;this.WriteRuntimeObject(t,r);}}catch(t){i.e(t);}finally{i.f();}t.WriteArrayEnd();}},{key:"WriteIntDictionary",value:function(t,e){t.WriteObjectStart();var n,i=m(e);try{for(i.s();!(n=i.n()).done;){var r=v(n.value,2),a=r[0],s=r[1];t.WriteIntProperty(a,s);}}catch(t){i.e(t);}finally{i.f();}t.WriteObjectEnd();}},{key:"WriteRuntimeObject",value:function(e,n){var i=k(n,q);if(i)this.WriteRuntimeContainer(e,i);else {var r=k(n,X);if(r){var a,s="->";return r.isExternal?s="x()":r.pushesToStack&&(r.stackPushType==U.Function?s="f()":r.stackPushType==U.Tunnel&&(s="->t->")),a=r.hasVariableTarget?r.variableDivertName:r.targetPathString,e.WriteObjectStart(),e.WriteProperty(s,a),r.hasVariableTarget&&e.WriteProperty("var",!0),r.isConditional&&e.WriteProperty("c",!0),r.externalArgs>0&&e.WriteIntProperty("exArgs",r.externalArgs),void e.WriteObjectEnd()}var o=k(n,$);if(o)return e.WriteObjectStart(),e.WriteProperty("*",o.pathStringOnChoice),e.WriteIntProperty("flg",o.flags),void e.WriteObjectEnd();var u=k(n,L);if(u)e.WriteBool(u.value);else {var l=k(n,R);if(l)e.WriteInt(l.value);else {var h=k(n,j);if(h)e.WriteFloat(h.value);else {var c=k(n,D);if(c)c.isNewline?e.Write("\n",!1):(e.WriteStringStart(),e.WriteStringInner("^"),e.WriteStringInner(c.value),e.WriteStringEnd());else {var f=k(n,M);if(f)this.WriteInkList(e,f);else {var v=k(n,B);if(v)return e.WriteObjectStart(),null===v.value?O("divTargetVal.value"):(e.WriteProperty("^->",v.value.componentsString),void e.WriteObjectEnd());var d=k(n,G);if(d)return e.WriteObjectStart(),e.WriteProperty("^var",d.value),e.WriteIntProperty("ci",d.contextIndex),void e.WriteObjectEnd();if(k(n,K))e.Write("<>");else {var p=k(n,z);if(p)e.Write(t._controlCommandNames[p.commandType]);else {var y=k(n,tt);if(y){var m=y.name;return "^"==m&&(m="L^"),void e.Write(m)}var g=k(n,Y);if(g){e.WriteObjectStart();var S=g.pathStringForCount;return null!=S?e.WriteProperty("CNT?",S):e.WriteProperty("VAR?",g.name),void e.WriteObjectEnd()}var C=k(n,Q);if(C){e.WriteObjectStart();var b=C.isGlobal?"VAR=":"temp=";return e.WriteProperty(b,C.variableName),C.isNewDeclaration||e.WriteProperty("re",!0),void e.WriteObjectEnd()}if(k(n,Z))e.Write("void");else {var _=k(n,et);if(_)return e.WriteObjectStart(),e.WriteProperty("#",_.text),void e.WriteObjectEnd();var w=k(n,nt);if(!w)throw new Error("Failed to convert runtime object to Json token: "+n);this.WriteChoice(e,w);}}}}}}}}}}},{key:"JObjectToDictionaryRuntimeObjs",value:function(t){var e=new Map;for(var n in t)if(t.hasOwnProperty(n)){var i=this.JTokenToRuntimeObject(t[n]);if(null===i)return O("inkObject");e.set(n,i);}return e}},{key:"JObjectToIntDictionary",value:function(t){var e=new Map;for(var n in t)t.hasOwnProperty(n)&&e.set(n,parseInt(t[n]));return e}},{key:"JTokenToRuntimeObject",value:function(n){if("number"==typeof n&&!isNaN(n)||"boolean"==typeof n)return V.Create(n);if("string"==typeof n){var i=n.toString(),r=i[0];if("^"==r)return new D(i.substring(1));if("\n"==r&&1==i.length)return new D("\n");if("<>"==i)return new K;for(var a=0;a<t._controlCommandNames.length;++a){if(i==t._controlCommandNames[a])return new z(a)}if("L^"==i&&(i="^"),tt.CallExistsWithName(i))return tt.CallWithName(i);if("->->"==i)return z.PopTunnel();if("~ret"==i)return z.PopFunction();if("void"==i)return new Z}if("object"===e(n)&&!Array.isArray(n)){var s,o=n;if(o["^->"])return s=o["^->"],new B(new S(s.toString()));if(o["^var"]){s=o["^var"];var u=new G(s.toString());return "ci"in o&&(s=o.ci,u.contextIndex=parseInt(s)),u}var l=!1,h=!1,c=U.Function,f=!1;if((s=o["->"])?l=!0:(s=o["f()"])?(l=!0,h=!0,c=U.Function):(s=o["->t->"])?(l=!0,h=!0,c=U.Tunnel):(s=o["x()"])&&(l=!0,f=!0,h=!1,c=U.Function),l){var v=new X;v.pushesToStack=h,v.stackPushType=c,v.isExternal=f;var d=s.toString();return (s=o.var)?v.variableDivertName=d:v.targetPathString=d,v.isConditional=!!o.c,f&&(s=o.exArgs)&&(v.externalArgs=parseInt(s)),v}if(s=o["*"]){var p=new $;return p.pathStringOnChoice=s.toString(),(s=o.flg)&&(p.flags=parseInt(s)),p}if(s=o["VAR?"])return new Y(s.toString());if(s=o["CNT?"]){var y=new Y;return y.pathStringForCount=s.toString(),y}var m=!1,g=!1;if((s=o["VAR="])?(m=!0,g=!0):(s=o["temp="])&&(m=!0,g=!1),m){var k=s.toString(),C=!o.re,b=new Q(k,C);return b.isGlobal=g,b}if(void 0!==o["#"])return s=o["#"],new et(s.toString());if(s=o.list){var _=s,w=new I;if(s=o.origins){var T=s;w.SetInitialOriginNames(T);}for(var E in _)if(_.hasOwnProperty(E)){var O=_[E],P=new A(E),N=parseInt(O);w.Add(P,N);}return new M(w)}if(null!=o.originalChoicePath)return this.JObjectToChoice(o)}if(Array.isArray(n))return this.JArrayToContainer(n);if(null==n)return null;throw new Error("Failed to convert token to runtime object: "+this.toJson(n,["parent"]))}},{key:"toJson",value:function(t,e,n){return JSON.stringify(t,(function(t,n){return (null==e?void 0:e.some((function(e){return e===t})))?void 0:n}),n)}},{key:"WriteRuntimeContainer",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(t.WriteArrayStart(),null===e)return O("container");var i,r=m(e.content);try{for(r.s();!(i=r.n()).done;){var a=i.value;this.WriteRuntimeObject(t,a);}}catch(t){r.e(t);}finally{r.f();}var s=e.namedOnlyContent,o=e.countFlags,u=null!=e.name&&!n,l=null!=s||o>0||u;if(l&&t.WriteObjectStart(),null!=s){var h,c=m(s);try{for(c.s();!(h=c.n()).done;){var f=v(h.value,2),d=f[0],p=f[1],y=d,g=k(p,q);t.WritePropertyStart(y),this.WriteRuntimeContainer(t,g,!0),t.WritePropertyEnd();}}catch(t){c.e(t);}finally{c.f();}}o>0&&t.WriteIntProperty("#f",o),u&&t.WriteProperty("#n",e.name),l?t.WriteObjectEnd():t.WriteNull(),t.WriteArrayEnd();}},{key:"JArrayToContainer",value:function(t){var e=new q;e.content=this.JArrayToRuntimeObjList(t,!0);var n=t[t.length-1];if(null!=n){var i=new Map;for(var r in n)if("#f"==r)e.countFlags=parseInt(n[r]);else if("#n"==r)e.name=n[r].toString();else {var a=this.JTokenToRuntimeObject(n[r]),s=k(a,q);s&&(s.name=r),i.set(r,a);}e.namedOnlyContent=i;}return e}},{key:"JObjectToChoice",value:function(t){var e=new nt;return e.text=t.text.toString(),e.index=parseInt(t.index),e.sourcePath=t.originalChoicePath.toString(),e.originalThreadIndex=parseInt(t.originalThreadIndex),e.pathStringOnChoice=t.targetPath.toString(),e}},{key:"WriteChoice",value:function(t,e){t.WriteObjectStart(),t.WriteProperty("text",e.text),t.WriteIntProperty("index",e.index),t.WriteProperty("originalChoicePath",e.sourcePath),t.WriteIntProperty("originalThreadIndex",e.originalThreadIndex),t.WriteProperty("targetPath",e.pathStringOnChoice),t.WriteObjectEnd();}},{key:"WriteInkList",value:function(t,e){var n=e.value;if(null===n)return O("rawList");t.WriteObjectStart(),t.WritePropertyStart("list"),t.WriteObjectStart();var i,r=m(n);try{for(r.s();!(i=r.n()).done;){var a=v(i.value,2),s=a[0],o=a[1],u=A.fromSerializedKey(s),l=o;if(null===u.itemName)return O("item.itemName");t.WritePropertyNameStart(),t.WritePropertyNameInner(u.originName?u.originName:"?"),t.WritePropertyNameInner("."),t.WritePropertyNameInner(u.itemName),t.WritePropertyNameEnd(),t.Write(l),t.WritePropertyEnd();}}catch(t){r.e(t);}finally{r.f();}if(t.WriteObjectEnd(),t.WritePropertyEnd(),0==n.Count&&null!=n.originNames&&n.originNames.length>0){t.WritePropertyStart("origins"),t.WriteArrayStart();var h,c=m(n.originNames);try{for(c.s();!(h=c.n()).done;){var f=h.value;t.Write(f);}}catch(t){c.e(t);}finally{c.f();}t.WriteArrayEnd(),t.WritePropertyEnd();}t.WriteObjectEnd();}},{key:"ListDefinitionsToJToken",value:function(t){var e,n={},i=m(t.lists);try{for(i.s();!(e=i.n()).done;){var r,a=e.value,s={},o=m(a.items);try{for(o.s();!(r=o.n()).done;){var u=v(r.value,2),l=u[0],h=u[1],c=A.fromSerializedKey(l);if(null===c.itemName)return O("item.itemName");s[c.itemName]=h;}}catch(t){o.e(t);}finally{o.f();}n[a.name]=s;}}catch(t){i.e(t);}finally{i.f();}return n}},{key:"JTokenToListDefinitions",value:function(t){var e=t,n=[];for(var i in e)if(e.hasOwnProperty(i)){var r=i.toString(),a=e[i],s=new Map;for(var o in a)if(e.hasOwnProperty(i)){var u=a[o];s.set(o,parseInt(u));}var l=new it(r,s);n.push(l);}return new rt(n)}}]),t}();at._controlCommandNames=function(){var t=[];t[z.CommandType.EvalStart]="ev",t[z.CommandType.EvalOutput]="out",t[z.CommandType.EvalEnd]="/ev",t[z.CommandType.Duplicate]="du",t[z.CommandType.PopEvaluatedValue]="pop",t[z.CommandType.PopFunction]="~ret",t[z.CommandType.PopTunnel]="->->",t[z.CommandType.BeginString]="str",t[z.CommandType.EndString]="/str",t[z.CommandType.NoOp]="nop",t[z.CommandType.ChoiceCount]="choiceCnt",t[z.CommandType.Turns]="turn",t[z.CommandType.TurnsSince]="turns",t[z.CommandType.ReadCount]="readc",t[z.CommandType.Random]="rnd",t[z.CommandType.SeedRandom]="srnd",t[z.CommandType.VisitIndex]="visit",t[z.CommandType.SequenceShuffleIndex]="seq",t[z.CommandType.StartThread]="thread",t[z.CommandType.Done]="done",t[z.CommandType.End]="end",t[z.CommandType.ListFromInt]="listInt",t[z.CommandType.ListRange]="range",t[z.CommandType.ListRandom]="lrnd";for(var e=0;e<z.CommandType.TOTAL_VALUES;++e)if(null==t[e])throw new Error("Control command not accounted for in serialisation");return t}();var st=function(){function e(){if(n(this,e),this._threadCounter=0,this._startOfRoot=H.Null,arguments[0]instanceof t.Story){var i=arguments[0];this._startOfRoot=H.StartOf(i.rootContentContainer),this.Reset();}else {var r=arguments[0];this._threads=[];var a,s=m(r._threads);try{for(s.s();!(a=s.n()).done;){var o=a.value;this._threads.push(o.Copy());}}catch(t){s.e(t);}finally{s.f();}this._threadCounter=r._threadCounter,this._startOfRoot=r._startOfRoot.copy();}}return r(e,[{key:"elements",get:function(){return this.callStack}},{key:"depth",get:function(){return this.elements.length}},{key:"currentElement",get:function(){var t=this._threads[this._threads.length-1].callstack;return t[t.length-1]}},{key:"currentElementIndex",get:function(){return this.callStack.length-1}},{key:"currentThread",get:function(){return this._threads[this._threads.length-1]},set:function(t){g.Assert(1==this._threads.length,"Shouldn't be directly setting the current thread when we have a stack of them"),this._threads.length=0,this._threads.push(t);}},{key:"canPop",get:function(){return this.callStack.length>1}},{key:"Reset",value:function(){this._threads=[],this._threads.push(new e.Thread),this._threads[0].callstack.push(new e.Element(U.Tunnel,this._startOfRoot));}},{key:"SetJsonToken",value:function(t,n){this._threads.length=0;var i,r=m(t.threads);try{for(r.s();!(i=r.n()).done;){var a=i.value,s=new e.Thread(a,n);this._threads.push(s);}}catch(t){r.e(t);}finally{r.f();}this._threadCounter=parseInt(t.threadCounter),this._startOfRoot=H.StartOf(n.rootContentContainer);}},{key:"WriteJson",value:function(t){var e=this;t.WriteObject((function(t){t.WritePropertyStart("threads"),t.WriteArrayStart();var n,i=m(e._threads);try{for(i.s();!(n=i.n()).done;){n.value.WriteJson(t);}}catch(t){i.e(t);}finally{i.f();}t.WriteArrayEnd(),t.WritePropertyEnd(),t.WritePropertyStart("threadCounter"),t.WriteInt(e._threadCounter),t.WritePropertyEnd();}));}},{key:"PushThread",value:function(){var t=this.currentThread.Copy();this._threadCounter++,t.threadIndex=this._threadCounter,this._threads.push(t);}},{key:"ForkThread",value:function(){var t=this.currentThread.Copy();return this._threadCounter++,t.threadIndex=this._threadCounter,t}},{key:"PopThread",value:function(){if(!this.canPopThread)throw new Error("Can't pop thread");this._threads.splice(this._threads.indexOf(this.currentThread),1);}},{key:"canPopThread",get:function(){return this._threads.length>1&&!this.elementIsEvaluateFromGame}},{key:"elementIsEvaluateFromGame",get:function(){return this.currentElement.type==U.FunctionEvaluationFromGame}},{key:"Push",value:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=new e.Element(t,this.currentElement.currentPointer,!1);r.evaluationStackHeightWhenPushed=n,r.functionStartInOutputStream=i,this.callStack.push(r);}},{key:"CanPop",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;return !!this.canPop&&(null==t||this.currentElement.type==t)}},{key:"Pop",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;if(!this.CanPop(t))throw new Error("Mismatched push/pop in Callstack");this.callStack.pop();}},{key:"GetTemporaryVariableWithName",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1;-1==e&&(e=this.currentElementIndex+1);var n=this.callStack[e-1],i=F(n.temporaryVariables,t,null);return i.exists?i.result:null}},{key:"SetTemporaryVariable",value:function(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:-1;-1==i&&(i=this.currentElementIndex+1);var r=this.callStack[i-1];if(!n&&!r.temporaryVariables.get(t))throw new Error("Could not find temporary variable to set: "+t);var a=F(r.temporaryVariables,t,null);a.exists&&M.RetainListOriginsForAssignment(a.result,e),r.temporaryVariables.set(t,e);}},{key:"ContextForVariableNamed",value:function(t){return this.currentElement.temporaryVariables.get(t)?this.currentElementIndex+1:0}},{key:"ThreadWithIndex",value:function(t){var e=this._threads.filter((function(e){if(e.threadIndex==t)return e}));return e.length>0?e[0]:null}},{key:"callStack",get:function(){return this.currentThread.callstack}},{key:"callStackTrace",get:function(){for(var t=new N,e=0;e<this._threads.length;e++){var n=this._threads[e],i=e==this._threads.length-1;t.AppendFormat("=== THREAD {0}/{1} {2}===\n",e+1,this._threads.length,i?"(current) ":"");for(var r=0;r<n.callstack.length;r++){n.callstack[r].type==U.Function?t.Append("  [FUNCTION] "):t.Append("  [TUNNEL] ");var a=n.callstack[r].currentPointer;if(!a.isNull){if(t.Append("<SOMEWHERE IN "),null===a.container)return O("pointer.container");t.Append(a.container.path.toString()),t.AppendLine(">");}}}return t.toString()}}]),e}();!function(t){var e=function(){function t(e,i){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2];n(this,t),this.evaluationStackHeightWhenPushed=0,this.functionStartInOutputStream=0,this.currentPointer=i.copy(),this.inExpressionEvaluation=r,this.temporaryVariables=new Map,this.type=e;}return r(t,[{key:"Copy",value:function(){var e=new t(this.type,this.currentPointer,this.inExpressionEvaluation);return e.temporaryVariables=new Map(this.temporaryVariables),e.evaluationStackHeightWhenPushed=this.evaluationStackHeightWhenPushed,e.functionStartInOutputStream=this.functionStartInOutputStream,e}}]),t}();t.Element=e;var i=function(){function t(){if(n(this,t),this.threadIndex=0,this.previousPointer=H.Null,this.callstack=[],arguments[0]&&arguments[1]){var i=arguments[0],r=arguments[1];this.threadIndex=parseInt(i.threadIndex);var a,s=i.callstack,o=m(s);try{for(o.s();!(a=o.n()).done;){var u=a.value,l=u,h=parseInt(l.type),c=H.Null,f=void 0,v=l.cPath;if(void 0!==v){f=v.toString();var d=r.ContentAtPath(new S(f));if(c.container=d.container,c.index=parseInt(l.idx),null==d.obj)throw new Error("When loading state, internal story location couldn't be found: "+f+". Has the story changed since this save data was created?");if(d.approximate){if(null===c.container)return O("pointer.container");r.Warning("When loading state, exact internal story location couldn't be found: '"+f+"', so it was approximated to '"+c.container.path.toString()+"' to recover. Has the story changed since this save data was created?");}}var p=!!l.exp,y=new e(h,c,p),g=l.temp;void 0!==g?y.temporaryVariables=at.JObjectToDictionaryRuntimeObjs(g):y.temporaryVariables.clear(),this.callstack.push(y);}}catch(t){o.e(t);}finally{o.f();}var k=i.previousContentObject;if(void 0!==k){var C=new S(k.toString());this.previousPointer=r.PointerAtPath(C);}}}return r(t,[{key:"Copy",value:function(){var e=new t;e.threadIndex=this.threadIndex;var n,i=m(this.callstack);try{for(i.s();!(n=i.n()).done;){var r=n.value;e.callstack.push(r.Copy());}}catch(t){i.e(t);}finally{i.f();}return e.previousPointer=this.previousPointer.copy(),e}},{key:"WriteJson",value:function(t){t.WriteObjectStart(),t.WritePropertyStart("callstack"),t.WriteArrayStart();var e,n=m(this.callstack);try{for(n.s();!(e=n.n()).done;){var i=e.value;if(t.WriteObjectStart(),!i.currentPointer.isNull){if(null===i.currentPointer.container)return O("el.currentPointer.container");t.WriteProperty("cPath",i.currentPointer.container.path.componentsString),t.WriteIntProperty("idx",i.currentPointer.index);}t.WriteProperty("exp",i.inExpressionEvaluation),t.WriteIntProperty("type",i.type),i.temporaryVariables.size>0&&(t.WritePropertyStart("temp"),at.WriteDictionaryRuntimeObjs(t,i.temporaryVariables),t.WritePropertyEnd()),t.WriteObjectEnd();}}catch(t){n.e(t);}finally{n.f();}if(t.WriteArrayEnd(),t.WritePropertyEnd(),t.WriteIntProperty("threadIndex",this.threadIndex),!this.previousPointer.isNull){var r=this.previousPointer.Resolve();if(null===r)return O("this.previousPointer.Resolve()");t.WriteProperty("previousContentObject",r.path.toString());}t.WriteObjectEnd();}}]),t}();t.Thread=i;}(st||(st={}));var ot=function(){function t(e,i){n(this,t),this.variableChangedEventCallbacks=[],this.patch=null,this._batchObservingVariableChanges=!1,this._defaultGlobalVariables=new Map,this._changedVariablesForBatchObs=new Set,this._globalVariables=new Map,this._callStack=e,this._listDefsOrigin=i;try{return new Proxy(this,{get:function(t,e){return e in t?t[e]:t.$(e)},set:function(t,e,n){return e in t?t[e]=n:t.$(e,n),!0}})}catch(t){}}return r(t,[{key:"variableChangedEvent",value:function(t,e){var n,i=m(this.variableChangedEventCallbacks);try{for(i.s();!(n=i.n()).done;){(0,n.value)(t,e);}}catch(t){i.e(t);}finally{i.f();}}},{key:"batchObservingVariableChanges",get:function(){return this._batchObservingVariableChanges},set:function(t){if(this._batchObservingVariableChanges=t,t)this._changedVariablesForBatchObs=new Set;else if(null!=this._changedVariablesForBatchObs){var e,n=m(this._changedVariablesForBatchObs);try{for(n.s();!(e=n.n()).done;){var i=e.value,r=this._globalVariables.get(i);r?this.variableChangedEvent(i,r):O("currentValue");}}catch(t){n.e(t);}finally{n.f();}this._changedVariablesForBatchObs=null;}}},{key:"callStack",get:function(){return this._callStack},set:function(t){this._callStack=t;}},{key:"$",value:function(t,e){if(void 0===e){var n=null;return null!==this.patch&&(n=this.patch.TryGetGlobal(t,null)).exists?n.result.valueObject:(void 0===(n=this._globalVariables.get(t))&&(n=this._defaultGlobalVariables.get(t)),void 0!==n?n.valueObject:null)}if(void 0===this._defaultGlobalVariables.get(t))throw new x("Cannot assign to a variable ("+t+") that hasn't been declared in the story");var i=V.Create(e);if(null==i)throw null==e?new Error("Cannot pass null to VariableState"):new Error("Invalid value passed to VariableState: "+e.toString());this.SetGlobal(t,i);}},{key:"ApplyPatch",value:function(){if(null===this.patch)return O("this.patch");var t,e=m(this.patch.globals);try{for(e.s();!(t=e.n()).done;){var n=v(t.value,2),i=n[0],r=n[1];this._globalVariables.set(i,r);}}catch(t){e.e(t);}finally{e.f();}if(null!==this._changedVariablesForBatchObs){var a,s=m(this.patch.changedVariables);try{for(s.s();!(a=s.n()).done;){var o=a.value;this._changedVariablesForBatchObs.add(o);}}catch(t){s.e(t);}finally{s.f();}}this.patch=null;}},{key:"SetJsonToken",value:function(t){this._globalVariables.clear();var e,n=m(this._defaultGlobalVariables);try{for(n.s();!(e=n.n()).done;){var i=v(e.value,2),r=i[0],a=i[1],s=t[r];if(void 0!==s){var o=at.JTokenToRuntimeObject(s);if(null===o)return O("tokenInkObject");this._globalVariables.set(r,o);}else this._globalVariables.set(r,a);}}catch(t){n.e(t);}finally{n.f();}}},{key:"WriteJson",value:function(e){e.WriteObjectStart();var n,i=m(this._globalVariables);try{for(i.s();!(n=i.n()).done;){var r=v(n.value,2),a=r[0],s=r[1],o=a,u=s;if(t.dontSaveDefaultValues&&this._defaultGlobalVariables.has(o)){var l=this._defaultGlobalVariables.get(o);if(this.RuntimeObjectsEqual(u,l))continue}e.WritePropertyStart(o),at.WriteRuntimeObject(e,u),e.WritePropertyEnd();}}catch(t){i.e(t);}finally{i.f();}e.WriteObjectEnd();}},{key:"RuntimeObjectsEqual",value:function(t,e){if(null===t)return O("obj1");if(null===e)return O("obj2");if(t.constructor!==e.constructor)return !1;var n=k(t,L);if(null!==n)return n.value===C(e,L).value;var i=k(t,R);if(null!==i)return i.value===C(e,R).value;var r=k(t,j);if(null!==r)return r.value===C(e,j).value;var a=k(t,V),s=k(e,V);if(null!==a&&null!==s)return w(a.valueObject)&&w(s.valueObject)?a.valueObject.Equals(s.valueObject):a.valueObject===s.valueObject;throw new Error("FastRoughDefinitelyEquals: Unsupported runtime object type: "+t.constructor.name)}},{key:"GetVariableWithName",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1,n=this.GetRawVariableWithName(t,e),i=k(n,G);return null!==i&&(n=this.ValueAtVariablePointer(i)),n}},{key:"TryGetDefaultVariableValue",value:function(t){var e=F(this._defaultGlobalVariables,t,null);return e.exists?e.result:null}},{key:"GlobalVariableExistsWithName",value:function(t){return this._globalVariables.has(t)||null!==this._defaultGlobalVariables&&this._defaultGlobalVariables.has(t)}},{key:"GetRawVariableWithName",value:function(t,e){if(0==e||-1==e){var n=null;if(null!==this.patch&&(n=this.patch.TryGetGlobal(t,null)).exists)return n.result;if((n=F(this._globalVariables,t,null)).exists)return n.result;if(null!==this._defaultGlobalVariables&&(n=F(this._defaultGlobalVariables,t,null)).exists)return n.result;if(null===this._listDefsOrigin)return O("VariablesState._listDefsOrigin");var i=this._listDefsOrigin.FindSingleItemListWithName(t);if(i)return i}return this._callStack.GetTemporaryVariableWithName(t,e)}},{key:"ValueAtVariablePointer",value:function(t){return this.GetVariableWithName(t.variableName,t.contextIndex)}},{key:"Assign",value:function(t,e){var n=t.variableName;if(null===n)return O("name");var i=-1,r=!1;if(r=t.isNewDeclaration?t.isGlobal:this.GlobalVariableExistsWithName(n),t.isNewDeclaration){var a=k(e,G);if(null!==a)e=this.ResolveVariablePointer(a);}else {var s=null;do{null!=(s=k(this.GetRawVariableWithName(n,i),G))&&(n=s.variableName,r=0==(i=s.contextIndex));}while(null!=s)}r?this.SetGlobal(n,e):this._callStack.SetTemporaryVariable(n,e,t.isNewDeclaration,i);}},{key:"SnapshotDefaultGlobals",value:function(){this._defaultGlobalVariables=new Map(this._globalVariables);}},{key:"RetainListOriginsForAssignment",value:function(t,e){var n=C(t,M),i=C(e,M);n.value&&i.value&&0==i.value.Count&&i.value.SetInitialOriginNames(n.value.originNames);}},{key:"SetGlobal",value:function(t,e){var n=null;if(null===this.patch&&(n=F(this._globalVariables,t,null)),null!==this.patch&&((n=this.patch.TryGetGlobal(t,null)).exists||(n=F(this._globalVariables,t,null))),M.RetainListOriginsForAssignment(n.result,e),null===t)return O("variableName");if(null!==this.patch?this.patch.SetGlobal(t,e):this._globalVariables.set(t,e),null!==this.variableChangedEvent&&null!==n&&e!==n.result)if(this.batchObservingVariableChanges){if(null===this._changedVariablesForBatchObs)return O("this._changedVariablesForBatchObs");null!==this.patch?this.patch.AddChangedVariable(t):null!==this._changedVariablesForBatchObs&&this._changedVariablesForBatchObs.add(t);}else this.variableChangedEvent(t,e);}},{key:"ResolveVariablePointer",value:function(t){var e=t.contextIndex;-1==e&&(e=this.GetContextIndexOfVariableNamed(t.variableName));var n=k(this.GetRawVariableWithName(t.variableName,e),G);return null!=n?n:new G(t.variableName,e)}},{key:"GetContextIndexOfVariableNamed",value:function(t){return this.GlobalVariableExistsWithName(t)?0:this._callStack.currentElementIndex}},{key:"ObserveVariableChange",value:function(t){this.variableChangedEventCallbacks.push(t);}}]),t}();ot.dontSaveDefaultValues=!0;var ut=function(){function t(e){n(this,t),this.seed=e%2147483647,this.seed<=0&&(this.seed+=2147483646);}return r(t,[{key:"next",value:function(){return this.seed=48271*this.seed%2147483647}},{key:"nextFloat",value:function(){return (this.next()-1)/2147483646}}]),t}(),lt=function(){function t(){if(n(this,t),this._changedVariables=new Set,this._visitCounts=new Map,this._turnIndices=new Map,1===arguments.length&&null!==arguments[0]){var e=arguments[0];this._globals=new Map(e._globals),this._changedVariables=new Set(e._changedVariables),this._visitCounts=new Map(e._visitCounts),this._turnIndices=new Map(e._turnIndices);}else this._globals=new Map,this._changedVariables=new Set,this._visitCounts=new Map,this._turnIndices=new Map;}return r(t,[{key:"globals",get:function(){return this._globals}},{key:"changedVariables",get:function(){return this._changedVariables}},{key:"visitCounts",get:function(){return this._visitCounts}},{key:"turnIndices",get:function(){return this._turnIndices}},{key:"TryGetGlobal",value:function(t,e){return null!==t&&this._globals.has(t)?{result:this._globals.get(t),exists:!0}:{result:e,exists:!1}}},{key:"SetGlobal",value:function(t,e){this._globals.set(t,e);}},{key:"AddChangedVariable",value:function(t){return this._changedVariables.add(t)}},{key:"TryGetVisitCount",value:function(t,e){return this._visitCounts.has(t)?{result:this._visitCounts.get(t),exists:!0}:{result:e,exists:!1}}},{key:"SetVisitCount",value:function(t,e){this._visitCounts.set(t,e);}},{key:"SetTurnIndex",value:function(t,e){this._turnIndices.set(t,e);}},{key:"TryGetTurnIndex",value:function(t,e){return this._turnIndices.has(t)?{result:this._turnIndices.get(t),exists:!0}:{result:e,exists:!1}}}]),t}(),ht=function(){function t(){n(this,t);}return r(t,null,[{key:"TextToDictionary",value:function(e){return new t.Reader(e).ToDictionary()}},{key:"TextToArray",value:function(e){return new t.Reader(e).ToArray()}}]),t}();!function(t){var e=function(){function t(e){n(this,t),this._rootObject=JSON.parse(e);}return r(t,[{key:"ToDictionary",value:function(){return this._rootObject}},{key:"ToArray",value:function(){return this._rootObject}}]),t}();t.Reader=e;var i=function(){function e(){n(this,e),this._currentPropertyName=null,this._currentString=null,this._stateStack=[],this._collectionStack=[],this._propertyNameStack=[],this._jsonObject=null;}return r(e,[{key:"WriteObject",value:function(t){this.WriteObjectStart(),t(this),this.WriteObjectEnd();}},{key:"WriteObjectStart",value:function(){this.StartNewObject(!0);var e={};if(this.state===t.Writer.State.Property){this.Assert(null!==this.currentCollection),this.Assert(null!==this.currentPropertyName);var n=this._propertyNameStack.pop();this.currentCollection[n]=e,this._collectionStack.push(e);}else this.state===t.Writer.State.Array?(this.Assert(null!==this.currentCollection),this.currentCollection.push(e),this._collectionStack.push(e)):(this.Assert(this.state===t.Writer.State.None),this._jsonObject=e,this._collectionStack.push(e));this._stateStack.push(new t.Writer.StateElement(t.Writer.State.Object));}},{key:"WriteObjectEnd",value:function(){this.Assert(this.state===t.Writer.State.Object),this._collectionStack.pop(),this._stateStack.pop();}},{key:"WriteProperty",value:function(t,e){if(this.WritePropertyStart(t),arguments[1]instanceof Function){var n=arguments[1];n(this);}else {var i=arguments[1];this.Write(i);}this.WritePropertyEnd();}},{key:"WriteIntProperty",value:function(t,e){this.WritePropertyStart(t),this.WriteInt(e),this.WritePropertyEnd();}},{key:"WriteFloatProperty",value:function(t,e){this.WritePropertyStart(t),this.WriteFloat(e),this.WritePropertyEnd();}},{key:"WritePropertyStart",value:function(e){this.Assert(this.state===t.Writer.State.Object),this._propertyNameStack.push(e),this.IncrementChildCount(),this._stateStack.push(new t.Writer.StateElement(t.Writer.State.Property));}},{key:"WritePropertyEnd",value:function(){this.Assert(this.state===t.Writer.State.Property),this.Assert(1===this.childCount),this._stateStack.pop();}},{key:"WritePropertyNameStart",value:function(){this.Assert(this.state===t.Writer.State.Object),this.IncrementChildCount(),this._currentPropertyName="",this._stateStack.push(new t.Writer.StateElement(t.Writer.State.Property)),this._stateStack.push(new t.Writer.StateElement(t.Writer.State.PropertyName));}},{key:"WritePropertyNameEnd",value:function(){this.Assert(this.state===t.Writer.State.PropertyName),this.Assert(null!==this._currentPropertyName),this._propertyNameStack.push(this._currentPropertyName),this._currentPropertyName=null,this._stateStack.pop();}},{key:"WritePropertyNameInner",value:function(e){this.Assert(this.state===t.Writer.State.PropertyName),this.Assert(null!==this._currentPropertyName),this._currentPropertyName+=e;}},{key:"WriteArrayStart",value:function(){this.StartNewObject(!0);var e=[];if(this.state===t.Writer.State.Property){this.Assert(null!==this.currentCollection),this.Assert(null!==this.currentPropertyName);var n=this._propertyNameStack.pop();this.currentCollection[n]=e,this._collectionStack.push(e);}else this.state===t.Writer.State.Array?(this.Assert(null!==this.currentCollection),this.currentCollection.push(e),this._collectionStack.push(e)):(this.Assert(this.state===t.Writer.State.None),this._jsonObject=e,this._collectionStack.push(e));this._stateStack.push(new t.Writer.StateElement(t.Writer.State.Array));}},{key:"WriteArrayEnd",value:function(){this.Assert(this.state===t.Writer.State.Array),this._collectionStack.pop(),this._stateStack.pop();}},{key:"Write",value:function(t){null!==t?(this.StartNewObject(!1),this._addToCurrentObject(t)):console.error("Warning: trying to write a null value");}},{key:"WriteBool",value:function(t){null!==t&&(this.StartNewObject(!1),this._addToCurrentObject(t));}},{key:"WriteInt",value:function(t){null!==t&&(this.StartNewObject(!1),this._addToCurrentObject(Math.floor(t)));}},{key:"WriteFloat",value:function(t){null!==t&&(this.StartNewObject(!1),t==Number.POSITIVE_INFINITY?this._addToCurrentObject(34e37):t==Number.NEGATIVE_INFINITY?this._addToCurrentObject(-34e37):isNaN(t)?this._addToCurrentObject(0):this._addToCurrentObject(t));}},{key:"WriteNull",value:function(){this.StartNewObject(!1),this._addToCurrentObject(null);}},{key:"WriteStringStart",value:function(){this.StartNewObject(!1),this._currentString="",this._stateStack.push(new t.Writer.StateElement(t.Writer.State.String));}},{key:"WriteStringEnd",value:function(){this.Assert(this.state==t.Writer.State.String),this._stateStack.pop(),this._addToCurrentObject(this._currentString),this._currentString=null;}},{key:"WriteStringInner",value:function(e){this.Assert(this.state===t.Writer.State.String),null!==e?this._currentString+=e:console.error("Warning: trying to write a null string");}},{key:"toString",value:function(){return null===this._jsonObject?"":JSON.stringify(this._jsonObject)}},{key:"StartNewObject",value:function(e){e?this.Assert(this.state===t.Writer.State.None||this.state===t.Writer.State.Property||this.state===t.Writer.State.Array):this.Assert(this.state===t.Writer.State.Property||this.state===t.Writer.State.Array),this.state===t.Writer.State.Property&&this.Assert(0===this.childCount),this.state!==t.Writer.State.Array&&this.state!==t.Writer.State.Property||this.IncrementChildCount();}},{key:"state",get:function(){return this._stateStack.length>0?this._stateStack[this._stateStack.length-1].type:t.Writer.State.None}},{key:"childCount",get:function(){return this._stateStack.length>0?this._stateStack[this._stateStack.length-1].childCount:0}},{key:"currentCollection",get:function(){return this._collectionStack.length>0?this._collectionStack[this._collectionStack.length-1]:null}},{key:"currentPropertyName",get:function(){return this._propertyNameStack.length>0?this._propertyNameStack[this._propertyNameStack.length-1]:null}},{key:"IncrementChildCount",value:function(){this.Assert(this._stateStack.length>0);var t=this._stateStack.pop();t.childCount++,this._stateStack.push(t);}},{key:"Assert",value:function(t){if(!t)throw Error("Assert failed while writing JSON")}},{key:"_addToCurrentObject",value:function(e){this.Assert(null!==this.currentCollection),this.state===t.Writer.State.Array?(this.Assert(Array.isArray(this.currentCollection)),this.currentCollection.push(e)):this.state===t.Writer.State.Property&&(this.Assert(!Array.isArray(this.currentCollection)),this.Assert(null!==this.currentPropertyName),this.currentCollection[this.currentPropertyName]=e,this._propertyNameStack.pop());}}]),e}();t.Writer=i,function(e){var i;(i=e.State||(e.State={}))[i.None=0]="None",i[i.Object=1]="Object",i[i.Array=2]="Array",i[i.Property=3]="Property",i[i.PropertyName=4]="PropertyName",i[i.String=5]="String";var a=r((function e(i){n(this,e),this.type=t.Writer.State.None,this.childCount=0,this.type=i;}));e.StateElement=a;}(i=t.Writer||(t.Writer={}));}(ht||(ht={}));var ct,ft,vt,dt=function(){function t(){n(this,t);var e=arguments[0],i=arguments[1];if(this.name=e,this.callStack=new st(i),arguments[2]){var r=arguments[2];this.callStack.SetJsonToken(r.callstack,i),this.outputStream=at.JArrayToRuntimeObjList(r.outputStream),this.currentChoices=at.JArrayToRuntimeObjList(r.currentChoices);var a=r.choiceThreads;void 0!==a&&this.LoadFlowChoiceThreads(a,i);}else this.outputStream=[],this.currentChoices=[];}return r(t,[{key:"WriteJson",value:function(t){var e=this;t.WriteObjectStart(),t.WriteProperty("callstack",(function(t){return e.callStack.WriteJson(t)})),t.WriteProperty("outputStream",(function(t){return at.WriteListRuntimeObjs(t,e.outputStream)}));var n,i=!1,r=m(this.currentChoices);try{for(r.s();!(n=r.n()).done;){var a=n.value;if(null===a.threadAtGeneration)return O("c.threadAtGeneration");a.originalThreadIndex=a.threadAtGeneration.threadIndex,null===this.callStack.ThreadWithIndex(a.originalThreadIndex)&&(i||(i=!0,t.WritePropertyStart("choiceThreads"),t.WriteObjectStart()),t.WritePropertyStart(a.originalThreadIndex),a.threadAtGeneration.WriteJson(t),t.WritePropertyEnd());}}catch(t){r.e(t);}finally{r.f();}i&&(t.WriteObjectEnd(),t.WritePropertyEnd()),t.WriteProperty("currentChoices",(function(t){t.WriteArrayStart();var n,i=m(e.currentChoices);try{for(i.s();!(n=i.n()).done;){var r=n.value;at.WriteChoice(t,r);}}catch(t){i.e(t);}finally{i.f();}t.WriteArrayEnd();})),t.WriteObjectEnd();}},{key:"LoadFlowChoiceThreads",value:function(t,e){var n,i=m(this.currentChoices);try{for(i.s();!(n=i.n()).done;){var r=n.value,a=this.callStack.ThreadWithIndex(r.originalThreadIndex);if(null!==a)r.threadAtGeneration=a.Copy();else {var s=t["".concat(r.originalThreadIndex)];r.threadAtGeneration=new st.Thread(s,e);}}}catch(t){i.e(t);}finally{i.f();}}}]),t}(),pt=function(){function e(t){n(this,e),this.kInkSaveStateVersion=9,this.kMinCompatibleLoadVersion=8,this.onDidLoadState=null,this._currentErrors=null,this._currentWarnings=null,this.divertedPointer=H.Null,this._currentTurnIndex=0,this.storySeed=0,this.previousRandom=0,this.didSafeExit=!1,this._currentText=null,this._currentTags=null,this._outputStreamTextDirty=!0,this._outputStreamTagsDirty=!0,this._patch=null,this._namedFlows=null,this.kDefaultFlowName="DEFAULT_FLOW",this.story=t,this._currentFlow=new dt(this.kDefaultFlowName,t),this.OutputStreamDirty(),this._evaluationStack=[],this._variablesState=new ot(this.callStack,t.listDefinitions),this._visitCounts=new Map,this._turnIndices=new Map,this.currentTurnIndex=-1;var i=(new Date).getTime();this.storySeed=new ut(i).next()%100,this.previousRandom=0,this.GoToStart();}return r(e,[{key:"ToJson",value:function(){var t=new ht.Writer;return this.WriteJson(t),t.toString()}},{key:"toJson",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return this.ToJson(t)}},{key:"LoadJson",value:function(t){var e=ht.TextToDictionary(t);this.LoadJsonObj(e),null!==this.onDidLoadState&&this.onDidLoadState();}},{key:"VisitCountAtPathString",value:function(t){var e;if(null!==this._patch){var n=this.story.ContentAtPath(new S(t)).container;if(null===n)throw new Error("Content at path not found: "+t);if((e=this._patch.TryGetVisitCount(n,0)).exists)return e.result}return (e=F(this._visitCounts,t,null)).exists?e.result:0}},{key:"VisitCountForContainer",value:function(t){if(null===t)return O("container");if(!t.visitsShouldBeCounted)return this.story.Error("Read count for target ("+t.name+" - on "+t.debugMetadata+") unknown. The story may need to be compiled with countAllVisits flag (-c)."),0;if(null!==this._patch){var e=this._patch.TryGetVisitCount(t,0);if(e.exists)return e.result}var n=t.path.toString(),i=F(this._visitCounts,n,null);return i.exists?i.result:0}},{key:"IncrementVisitCountForContainer",value:function(t){if(null!==this._patch){var e=this.VisitCountForContainer(t);return e++,void this._patch.SetVisitCount(t,e)}var n=t.path.toString(),i=F(this._visitCounts,n,null);i.exists?this._visitCounts.set(n,i.result+1):this._visitCounts.set(n,1);}},{key:"RecordTurnIndexVisitToContainer",value:function(t){if(null===this._patch){var e=t.path.toString();this._turnIndices.set(e,this.currentTurnIndex);}else this._patch.SetTurnIndex(t,this.currentTurnIndex);}},{key:"TurnsSinceForContainer",value:function(t){if(t.turnIndexShouldBeCounted||this.story.Error("TURNS_SINCE() for target ("+t.name+" - on "+t.debugMetadata+") unknown. The story may need to be compiled with countAllVisits flag (-c)."),null!==this._patch){var e=this._patch.TryGetTurnIndex(t,0);if(e.exists)return this.currentTurnIndex-e.result}var n=t.path.toString(),i=F(this._turnIndices,n,0);return i.exists?this.currentTurnIndex-i.result:-1}},{key:"callstackDepth",get:function(){return this.callStack.depth}},{key:"outputStream",get:function(){return this._currentFlow.outputStream}},{key:"currentChoices",get:function(){return this.canContinue?[]:this._currentFlow.currentChoices}},{key:"generatedChoices",get:function(){return this._currentFlow.currentChoices}},{key:"currentErrors",get:function(){return this._currentErrors}},{key:"currentWarnings",get:function(){return this._currentWarnings}},{key:"variablesState",get:function(){return this._variablesState},set:function(t){this._variablesState=t;}},{key:"callStack",get:function(){return this._currentFlow.callStack}},{key:"evaluationStack",get:function(){return this._evaluationStack}},{key:"currentTurnIndex",get:function(){return this._currentTurnIndex},set:function(t){this._currentTurnIndex=t;}},{key:"currentPathString",get:function(){var t=this.currentPointer;return t.isNull?null:null===t.path?O("pointer.path"):t.path.toString()}},{key:"currentPointer",get:function(){return this.callStack.currentElement.currentPointer.copy()},set:function(t){this.callStack.currentElement.currentPointer=t.copy();}},{key:"previousPointer",get:function(){return this.callStack.currentThread.previousPointer.copy()},set:function(t){this.callStack.currentThread.previousPointer=t.copy();}},{key:"canContinue",get:function(){return !this.currentPointer.isNull&&!this.hasError}},{key:"hasError",get:function(){return null!=this.currentErrors&&this.currentErrors.length>0}},{key:"hasWarning",get:function(){return null!=this.currentWarnings&&this.currentWarnings.length>0}},{key:"currentText",get:function(){if(this._outputStreamTextDirty){var t,e=new N,n=m(this.outputStream);try{for(n.s();!(t=n.n()).done;){var i=k(t.value,D);null!==i&&e.Append(i.value);}}catch(t){n.e(t);}finally{n.f();}this._currentText=this.CleanOutputWhitespace(e.toString()),this._outputStreamTextDirty=!1;}return this._currentText}},{key:"CleanOutputWhitespace",value:function(t){for(var e=new N,n=-1,i=0,r=0;r<t.length;r++){var a=t.charAt(r),s=" "==a||"\t"==a;s&&-1==n&&(n=r),s||("\n"!=a&&n>0&&n!=i&&e.Append(" "),n=-1),"\n"==a&&(i=r+1),s||e.Append(a);}return e.toString()}},{key:"currentTags",get:function(){if(this._outputStreamTagsDirty){this._currentTags=[];var t,e=m(this.outputStream);try{for(e.s();!(t=e.n()).done;){var n=k(t.value,et);null!==n&&this._currentTags.push(n.text);}}catch(t){e.e(t);}finally{e.f();}this._outputStreamTagsDirty=!1;}return this._currentTags}},{key:"currentFlowName",get:function(){return this._currentFlow.name}},{key:"inExpressionEvaluation",get:function(){return this.callStack.currentElement.inExpressionEvaluation},set:function(t){this.callStack.currentElement.inExpressionEvaluation=t;}},{key:"GoToStart",value:function(){this.callStack.currentElement.currentPointer=H.StartOf(this.story.mainContentContainer);}},{key:"SwitchFlow_Internal",value:function(t){if(null===t)throw new Error("Must pass a non-null string to Story.SwitchFlow");if(null===this._namedFlows&&(this._namedFlows=new Map,this._namedFlows.set(this.kDefaultFlowName,this._currentFlow)),t!==this._currentFlow.name){var e,n=F(this._namedFlows,t,null);n.exists?e=n.result:(e=new dt(t,this.story),this._namedFlows.set(t,e)),this._currentFlow=e,this.variablesState.callStack=this._currentFlow.callStack,this.OutputStreamDirty();}}},{key:"SwitchToDefaultFlow_Internal",value:function(){null!==this._namedFlows&&this.SwitchFlow_Internal(this.kDefaultFlowName);}},{key:"RemoveFlow_Internal",value:function(t){if(null===t)throw new Error("Must pass a non-null string to Story.DestroyFlow");if(t===this.kDefaultFlowName)throw new Error("Cannot destroy default flow");if(this._currentFlow.name===t&&this.SwitchToDefaultFlow_Internal(),null===this._namedFlows)return O("this._namedFlows");this._namedFlows.delete(t);}},{key:"CopyAndStartPatching",value:function(){var t,n,i,r,a,s=new e(this.story);if(s._patch=new lt(this._patch),s._currentFlow.name=this._currentFlow.name,s._currentFlow.callStack=new st(this._currentFlow.callStack),(t=s._currentFlow.currentChoices).push.apply(t,d(this._currentFlow.currentChoices)),(n=s._currentFlow.outputStream).push.apply(n,d(this._currentFlow.outputStream)),s.OutputStreamDirty(),null!==this._namedFlows){s._namedFlows=new Map;var o,u=m(this._namedFlows);try{for(u.s();!(o=u.n()).done;){var l=v(o.value,2),h=l[0],c=l[1];s._namedFlows.set(h,c);}}catch(t){u.e(t);}finally{u.f();}s._namedFlows.set(this._currentFlow.name,s._currentFlow);}this.hasError&&(s._currentErrors=[],(r=s._currentErrors).push.apply(r,d(this.currentErrors||[])));this.hasWarning&&(s._currentWarnings=[],(a=s._currentWarnings).push.apply(a,d(this.currentWarnings||[])));return s.variablesState=this.variablesState,s.variablesState.callStack=s.callStack,s.variablesState.patch=s._patch,(i=s.evaluationStack).push.apply(i,d(this.evaluationStack)),this.divertedPointer.isNull||(s.divertedPointer=this.divertedPointer.copy()),s.previousPointer=this.previousPointer.copy(),s._visitCounts=this._visitCounts,s._turnIndices=this._turnIndices,s.currentTurnIndex=this.currentTurnIndex,s.storySeed=this.storySeed,s.previousRandom=this.previousRandom,s.didSafeExit=this.didSafeExit,s}},{key:"RestoreAfterPatch",value:function(){this.variablesState.callStack=this.callStack,this.variablesState.patch=this._patch;}},{key:"ApplyAnyPatch",value:function(){if(null!==this._patch){this.variablesState.ApplyPatch();var t,e=m(this._patch.visitCounts);try{for(e.s();!(t=e.n()).done;){var n=v(t.value,2),i=n[0],r=n[1];this.ApplyCountChanges(i,r,!0);}}catch(t){e.e(t);}finally{e.f();}var a,s=m(this._patch.turnIndices);try{for(s.s();!(a=s.n()).done;){var o=v(a.value,2),u=o[0],l=o[1];this.ApplyCountChanges(u,l,!1);}}catch(t){s.e(t);}finally{s.f();}this._patch=null;}}},{key:"ApplyCountChanges",value:function(t,e,n){(n?this._visitCounts:this._turnIndices).set(t.path.toString(),e);}},{key:"WriteJson",value:function(e){var n=this;if(e.WriteObjectStart(),e.WritePropertyStart("flows"),e.WriteObjectStart(),null!==this._namedFlows){var i,r=m(this._namedFlows);try{var a=function(){var t=v(i.value,2),n=t[0],r=t[1];e.WriteProperty(n,(function(t){return r.WriteJson(t)}));};for(r.s();!(i=r.n()).done;)a();}catch(t){r.e(t);}finally{r.f();}}else e.WriteProperty(this._currentFlow.name,(function(t){return n._currentFlow.WriteJson(t)}));if(e.WriteObjectEnd(),e.WritePropertyEnd(),e.WriteProperty("currentFlowName",this._currentFlow.name),e.WriteProperty("variablesState",(function(t){return n.variablesState.WriteJson(t)})),e.WriteProperty("evalStack",(function(t){return at.WriteListRuntimeObjs(t,n.evaluationStack)})),!this.divertedPointer.isNull){if(null===this.divertedPointer.path)return O("divertedPointer");e.WriteProperty("currentDivertTarget",this.divertedPointer.path.componentsString);}e.WriteProperty("visitCounts",(function(t){return at.WriteIntDictionary(t,n._visitCounts)})),e.WriteProperty("turnIndices",(function(t){return at.WriteIntDictionary(t,n._turnIndices)})),e.WriteIntProperty("turnIdx",this.currentTurnIndex),e.WriteIntProperty("storySeed",this.storySeed),e.WriteIntProperty("previousRandom",this.previousRandom),e.WriteIntProperty("inkSaveVersion",this.kInkSaveStateVersion),e.WriteIntProperty("inkFormatVersion",t.Story.inkVersionCurrent),e.WriteObjectEnd();}},{key:"LoadJsonObj",value:function(t){var e=t,n=e.inkSaveVersion;if(null==n)throw new Error("ink save format incorrect, can't load.");if(parseInt(n)<this.kMinCompatibleLoadVersion)throw new Error("Ink save format isn't compatible with the current version (saw '"+n+"', but minimum is "+this.kMinCompatibleLoadVersion+"), so can't load.");var i=e.flows;if(null!=i){var r=i;1===Object.keys(r).length?this._namedFlows=null:null===this._namedFlows?this._namedFlows=new Map:this._namedFlows.clear();for(var a=0,s=Object.entries(r);a<s.length;a++){var o=v(s[a],2),u=o[0],l=o[1],h=new dt(u,this.story,l);if(1===Object.keys(r).length)this._currentFlow=new dt(u,this.story,l);else {if(null===this._namedFlows)return O("this._namedFlows");this._namedFlows.set(u,h);}}if(null!=this._namedFlows&&this._namedFlows.size>1){var c=e.currentFlowName;this._currentFlow=this._namedFlows.get(c);}}else {this._namedFlows=null,this._currentFlow.name=this.kDefaultFlowName,this._currentFlow.callStack.SetJsonToken(e.callstackThreads,this.story),this._currentFlow.outputStream=at.JArrayToRuntimeObjList(e.outputStream),this._currentFlow.currentChoices=at.JArrayToRuntimeObjList(e.currentChoices);var f=e.choiceThreads;this._currentFlow.LoadFlowChoiceThreads(f,this.story);}this.OutputStreamDirty(),this.variablesState.SetJsonToken(e.variablesState),this.variablesState.callStack=this._currentFlow.callStack,this._evaluationStack=at.JArrayToRuntimeObjList(e.evalStack);var d=e.currentDivertTarget;if(null!=d){var p=new S(d.toString());this.divertedPointer=this.story.PointerAtPath(p);}this._visitCounts=at.JObjectToIntDictionary(e.visitCounts),this._turnIndices=at.JObjectToIntDictionary(e.turnIndices),this.currentTurnIndex=parseInt(e.turnIdx),this.storySeed=parseInt(e.storySeed),this.previousRandom=parseInt(e.previousRandom);}},{key:"ResetErrors",value:function(){this._currentErrors=null,this._currentWarnings=null;}},{key:"ResetOutput",value:function(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;this.outputStream.length=0,null!==e&&(t=this.outputStream).push.apply(t,d(e)),this.OutputStreamDirty();}},{key:"PushToOutputStream",value:function(t){var e=k(t,D);if(null!==e){var n=this.TrySplittingHeadTailWhitespace(e);if(null!==n){var i,r=m(n);try{for(r.s();!(i=r.n()).done;){var a=i.value;this.PushToOutputStreamIndividual(a);}}catch(t){r.e(t);}finally{r.f();}return void this.OutputStreamDirty()}}this.PushToOutputStreamIndividual(t),this.OutputStreamDirty();}},{key:"PopFromOutputStream",value:function(t){this.outputStream.splice(this.outputStream.length-t,t),this.OutputStreamDirty();}},{key:"TrySplittingHeadTailWhitespace",value:function(t){var e=t.value;if(null===e)return O("single.value");for(var n=-1,i=-1,r=0;r<e.length;r++){var a=e[r];if("\n"!=a){if(" "==a||"\t"==a)continue;break}-1==n&&(n=r),i=r;}for(var s=-1,o=-1,u=e.length-1;u>=0;u--){var l=e[u];if("\n"!=l){if(" "==l||"\t"==l)continue;break}-1==s&&(s=u),o=u;}if(-1==n&&-1==s)return null;var h=[],c=0,f=e.length;if(-1!=n){if(n>0){var v=new D(e.substring(0,n));h.push(v);}h.push(new D("\n")),c=i+1;}if(-1!=s&&(f=o),f>c){var d=e.substring(c,f-c);h.push(new D(d));}if(-1!=s&&o>i&&(h.push(new D("\n")),s<e.length-1)){var p=e.length-s-1,y=new D(e.substring(s+1,p));h.push(y);}return h}},{key:"PushToOutputStreamIndividual",value:function(t){var e=k(t,K),n=k(t,D),i=!0;if(e)this.TrimNewlinesFromOutputStream(),i=!0;else if(n){var r=-1,a=this.callStack.currentElement;a.type==U.Function&&(r=a.functionStartInOutputStream);for(var s=-1,o=this.outputStream.length-1;o>=0;o--){var u=this.outputStream[o],l=u instanceof z?u:null;if(null!=(u instanceof K?u:null)){s=o;break}if(null!=l&&l.commandType==z.CommandType.BeginString){o>=r&&(r=-1);break}}if(-1!=(-1!=s&&-1!=r?Math.min(r,s):-1!=s?s:r)){if(n.isNewline)i=!1;else if(n.isNonWhitespace&&(s>-1&&this.RemoveExistingGlue(),r>-1))for(var h=this.callStack.elements,c=h.length-1;c>=0;c--){var f=h[c];if(f.type!=U.Function)break;f.functionStartInOutputStream=-1;}}else n.isNewline&&(!this.outputStreamEndsInNewline&&this.outputStreamContainsContent||(i=!1));}if(i){if(null===t)return O("obj");this.outputStream.push(t),this.OutputStreamDirty();}}},{key:"TrimNewlinesFromOutputStream",value:function(){for(var t=-1,e=this.outputStream.length-1;e>=0;){var n=this.outputStream[e],i=k(n,z),r=k(n,D);if(null!=i||null!=r&&r.isNonWhitespace)break;null!=r&&r.isNewline&&(t=e),e--;}if(t>=0)for(e=t;e<this.outputStream.length;){k(this.outputStream[e],D)?this.outputStream.splice(e,1):e++;}this.OutputStreamDirty();}},{key:"RemoveExistingGlue",value:function(){for(var t=this.outputStream.length-1;t>=0;t--){var e=this.outputStream[t];if(e instanceof K)this.outputStream.splice(t,1);else if(e instanceof z)break}this.OutputStreamDirty();}},{key:"outputStreamEndsInNewline",get:function(){if(this.outputStream.length>0)for(var t=this.outputStream.length-1;t>=0;t--){if(this.outputStream[t]instanceof z)break;var e=this.outputStream[t];if(e instanceof D){if(e.isNewline)return !0;if(e.isNonWhitespace)break}}return !1}},{key:"outputStreamContainsContent",get:function(){var t,e=m(this.outputStream);try{for(e.s();!(t=e.n()).done;){if(t.value instanceof D)return !0}}catch(t){e.e(t);}finally{e.f();}return !1}},{key:"inStringEvaluation",get:function(){for(var t=this.outputStream.length-1;t>=0;t--){var e=k(this.outputStream[t],z);if(e instanceof z&&e.commandType==z.CommandType.BeginString)return !0}return !1}},{key:"PushEvaluationStack",value:function(t){var e=k(t,M);if(e){var n=e.value;if(null===n)return O("rawList");if(null!=n.originNames){n.origins||(n.origins=[]),n.origins.length=0;var i,r=m(n.originNames);try{for(r.s();!(i=r.n()).done;){var a=i.value;if(null===this.story.listDefinitions)return O("StoryState.story.listDefinitions");var s=this.story.listDefinitions.TryListGetDefinition(a,null);if(null===s.result)return O("StoryState def.result");n.origins.indexOf(s.result)<0&&n.origins.push(s.result);}}catch(t){r.e(t);}finally{r.f();}}}if(null===t)return O("obj");this.evaluationStack.push(t);}},{key:"PopEvaluationStack",value:function(t){if(void 0===t)return _(this.evaluationStack.pop());if(t>this.evaluationStack.length)throw new Error("trying to pop too many objects");return _(this.evaluationStack.splice(this.evaluationStack.length-t,t))}},{key:"PeekEvaluationStack",value:function(){return this.evaluationStack[this.evaluationStack.length-1]}},{key:"ForceEnd",value:function(){this.callStack.Reset(),this._currentFlow.currentChoices.length=0,this.currentPointer=H.Null,this.previousPointer=H.Null,this.didSafeExit=!0;}},{key:"TrimWhitespaceFromFunctionEnd",value:function(){g.Assert(this.callStack.currentElement.type==U.Function);var t=this.callStack.currentElement.functionStartInOutputStream;-1==t&&(t=0);for(var e=this.outputStream.length-1;e>=t;e--){var n=this.outputStream[e],i=k(n,D),r=k(n,z);if(null!=i){if(r)break;if(!i.isNewline&&!i.isInlineWhitespace)break;this.outputStream.splice(e,1),this.OutputStreamDirty();}}}},{key:"PopCallStack",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;this.callStack.currentElement.type==U.Function&&this.TrimWhitespaceFromFunctionEnd(),this.callStack.Pop(t);}},{key:"SetChosenPath",value:function(t,e){this._currentFlow.currentChoices.length=0;var n=this.story.PointerAtPath(t);n.isNull||-1!=n.index||(n.index=0),this.currentPointer=n,e&&this.currentTurnIndex++;}},{key:"StartFunctionEvaluationFromGame",value:function(t,e){this.callStack.Push(U.FunctionEvaluationFromGame,this.evaluationStack.length),this.callStack.currentElement.currentPointer=H.StartOf(t),this.PassArgumentsToEvaluationStack(e);}},{key:"PassArgumentsToEvaluationStack",value:function(t){if(null!==t)for(var e=0;e<t.length;e++){if("number"!=typeof t[e]&&"string"!=typeof t[e]||t[e]instanceof I)throw new Error(("null"));this.PushEvaluationStack(V.Create(t[e]));}}},{key:"TryExitFunctionEvaluationFromGame",value:function(){return this.callStack.currentElement.type==U.FunctionEvaluationFromGame&&(this.currentPointer=H.Null,this.didSafeExit=!0,!0)}},{key:"CompleteFunctionEvaluationFromGame",value:function(){if(this.callStack.currentElement.type!=U.FunctionEvaluationFromGame)throw new Error("Expected external function evaluation to be complete. Stack trace: "+this.callStack.callStackTrace);for(var t=this.callStack.currentElement.evaluationStackHeightWhenPushed,e=null;this.evaluationStack.length>t;){var n=this.PopEvaluationStack();null===e&&(e=n);}if(this.PopCallStack(U.FunctionEvaluationFromGame),e){if(e instanceof Z)return null;var i=C(e,V);return i.valueType==W.DivertTarget?i.valueObject.toString():i.valueObject}return null}},{key:"AddError",value:function(t,e){e?(null==this._currentWarnings&&(this._currentWarnings=[]),this._currentWarnings.push(t)):(null==this._currentErrors&&(this._currentErrors=[]),this._currentErrors.push(t));}},{key:"OutputStreamDirty",value:function(){this._outputStreamTextDirty=!0,this._outputStreamTagsDirty=!0;}}]),e}(),yt=function(){function t(){n(this,t),this.startTime=void 0;}return r(t,[{key:"ElapsedMilliseconds",get:function(){return void 0===this.startTime?0:(new Date).getTime()-this.startTime}},{key:"Start",value:function(){this.startTime=(new Date).getTime();}},{key:"Stop",value:function(){this.startTime=void 0;}}]),t}();!function(t){t[t.Author=0]="Author",t[t.Warning=1]="Warning",t[t.Error=2]="Error";}(ct||(ct={})),Number.isInteger||(Number.isInteger=function(t){return "number"==typeof t&&isFinite(t)&&t>-9007199254740992&&t<9007199254740992&&Math.floor(t)===t}),t.Story=function(t){a(s,t);var i=f(s);function s(){var t,e;n(this,s),(t=i.call(this)).inkVersionMinimumCompatible=18,t.onError=null,t.onDidContinue=null,t.onMakeChoice=null,t.onEvaluateFunction=null,t.onCompleteEvaluateFunction=null,t.onChoosePathString=null,t._prevContainers=[],t.allowExternalFunctionFallbacks=!1,t._listDefinitions=null,t._variableObservers=null,t._hasValidatedExternals=!1,t._temporaryEvaluationContainer=null,t._asyncContinueActive=!1,t._stateSnapshotAtLastNewline=null,t._sawLookaheadUnsafeFunctionAfterNewline=!1,t._recursiveContinueCount=0,t._asyncSaving=!1,t._profiler=null;var r=null,a=null;if(arguments[0]instanceof q)e=arguments[0],void 0!==arguments[1]&&(r=arguments[1]),t._mainContentContainer=e;else if("string"==typeof arguments[0]){var o=arguments[0];a=ht.TextToDictionary(o);}else a=arguments[0];if(null!=r&&(t._listDefinitions=new rt(r)),t._externals=new Map,null!==a){var u=a,l=u.inkVersion;if(null==l)throw new Error("ink version number not found. Are you sure it's a valid .ink.json file?");var h=parseInt(l);if(h>s.inkVersionCurrent)throw new Error("Version of ink used to build story was newer than the current version of the engine");if(h<t.inkVersionMinimumCompatible)throw new Error("Version of ink used to build story is too old to be loaded by this version of the engine");h!=s.inkVersionCurrent&&console.warn("WARNING: Version of ink used to build story doesn't match current version of engine. Non-critical, but recommend synchronising.");var c,f=u.root;if(null==f)throw new Error("Root node for ink not found. Are you sure it's a valid .ink.json file?");(c=u.listDefs)&&(t._listDefinitions=at.JTokenToListDefinitions(c)),t._mainContentContainer=C(at.JTokenToRuntimeObject(f),q),t.ResetState();}return t}return r(s,[{key:"currentChoices",get:function(){var t=[];if(null===this._state)return O("this._state");var e,n=m(this._state.currentChoices);try{for(n.s();!(e=n.n()).done;){var i=e.value;i.isInvisibleDefault||(i.index=t.length,t.push(i));}}catch(t){n.e(t);}finally{n.f();}return t}},{key:"currentText",get:function(){return this.IfAsyncWeCant("call currentText since it's a work in progress"),this.state.currentText}},{key:"currentTags",get:function(){return this.IfAsyncWeCant("call currentTags since it's a work in progress"),this.state.currentTags}},{key:"currentErrors",get:function(){return this.state.currentErrors}},{key:"currentWarnings",get:function(){return this.state.currentWarnings}},{key:"currentFlowName",get:function(){return this.state.currentFlowName}},{key:"hasError",get:function(){return this.state.hasError}},{key:"hasWarning",get:function(){return this.state.hasWarning}},{key:"variablesState",get:function(){return this.state.variablesState}},{key:"listDefinitions",get:function(){return this._listDefinitions}},{key:"state",get:function(){return this._state}},{key:"StartProfiling",value:function(){}},{key:"EndProfiling",value:function(){}},{key:"ToJson",value:function(t){var e=this,n=!1;if(t||(n=!0,t=new ht.Writer),t.WriteObjectStart(),t.WriteIntProperty("inkVersion",s.inkVersionCurrent),t.WriteProperty("root",(function(t){return at.WriteRuntimeContainer(t,e._mainContentContainer)})),null!=this._listDefinitions){t.WritePropertyStart("listDefs"),t.WriteObjectStart();var i,r=m(this._listDefinitions.lists);try{for(r.s();!(i=r.n()).done;){var a=i.value;t.WritePropertyStart(a.name),t.WriteObjectStart();var o,u=m(a.items);try{for(u.s();!(o=u.n()).done;){var l=v(o.value,2),h=l[0],c=l[1],f=A.fromSerializedKey(h),d=c;t.WriteIntProperty(f.itemName,d);}}catch(t){u.e(t);}finally{u.f();}t.WriteObjectEnd(),t.WritePropertyEnd();}}catch(t){r.e(t);}finally{r.f();}t.WriteObjectEnd(),t.WritePropertyEnd();}if(t.WriteObjectEnd(),n)return t.toString()}},{key:"ResetState",value:function(){this.IfAsyncWeCant("ResetState"),this._state=new pt(this),this._state.variablesState.ObserveVariableChange(this.VariableStateDidChangeEvent.bind(this)),this.ResetGlobals();}},{key:"ResetErrors",value:function(){if(null===this._state)return O("this._state");this._state.ResetErrors();}},{key:"ResetCallstack",value:function(){if(this.IfAsyncWeCant("ResetCallstack"),null===this._state)return O("this._state");this._state.ForceEnd();}},{key:"ResetGlobals",value:function(){if(this._mainContentContainer.namedContent.get("global decl")){var t=this.state.currentPointer.copy();this.ChoosePath(new S("global decl"),!1),this.ContinueInternal(),this.state.currentPointer=t;}this.state.variablesState.SnapshotDefaultGlobals();}},{key:"SwitchFlow",value:function(t){if(this.IfAsyncWeCant("switch flow"),this._asyncSaving)throw new Error("Story is already in background saving mode, can't switch flow to "+t);this.state.SwitchFlow_Internal(t);}},{key:"RemoveFlow",value:function(t){this.state.RemoveFlow_Internal(t);}},{key:"SwitchToDefaultFlow",value:function(){this.state.SwitchToDefaultFlow_Internal();}},{key:"Continue",value:function(){return this.ContinueAsync(0),this.currentText}},{key:"canContinue",get:function(){return this.state.canContinue}},{key:"asyncContinueComplete",get:function(){return !this._asyncContinueActive}},{key:"ContinueAsync",value:function(t){this._hasValidatedExternals||this.ValidateExternalBindings(),this.ContinueInternal(t);}},{key:"ContinueInternal",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;null!=this._profiler&&this._profiler.PreContinue();var e=t>0;if(this._recursiveContinueCount++,!this._asyncContinueActive){if(this._asyncContinueActive=e,!this.canContinue)throw new Error("Can't continue - should check canContinue before calling Continue");this._state.didSafeExit=!1,this._state.ResetOutput(),1==this._recursiveContinueCount&&(this._state.variablesState.batchObservingVariableChanges=!0);}var n=new yt;n.Start();var i=!1;this._sawLookaheadUnsafeFunctionAfterNewline=!1;do{try{i=this.ContinueSingleStep();}catch(t){if(!(t instanceof x))throw t;this.AddError(t.message,void 0,t.useEndLineNumber);break}if(i)break;if(this._asyncContinueActive&&n.ElapsedMilliseconds>t)break}while(this.canContinue);if(n.Stop(),!i&&this.canContinue||(null!==this._stateSnapshotAtLastNewline&&this.RestoreStateSnapshot(),this.canContinue||(this.state.callStack.canPopThread&&this.AddError("Thread available to pop, threads should always be flat by the end of evaluation?"),0!=this.state.generatedChoices.length||this.state.didSafeExit||null!=this._temporaryEvaluationContainer||(this.state.callStack.CanPop(U.Tunnel)?this.AddError("unexpectedly reached end of content. Do you need a '->->' to return from a tunnel?"):this.state.callStack.CanPop(U.Function)?this.AddError("unexpectedly reached end of content. Do you need a '~ return'?"):this.state.callStack.canPop?this.AddError("unexpectedly reached end of content for unknown reason. Please debug compiler!"):this.AddError("ran out of content. Do you need a '-> DONE' or '-> END'?"))),this.state.didSafeExit=!1,this._sawLookaheadUnsafeFunctionAfterNewline=!1,1==this._recursiveContinueCount&&(this._state.variablesState.batchObservingVariableChanges=!1),this._asyncContinueActive=!1,null!==this.onDidContinue&&this.onDidContinue()),this._recursiveContinueCount--,null!=this._profiler&&this._profiler.PostContinue(),this.state.hasError||this.state.hasWarning){if(null===this.onError){var r=new N;throw r.Append("Ink had "),this.state.hasError&&(r.Append("".concat(this.state.currentErrors.length)),r.Append(1==this.state.currentErrors.length?" error":"errors"),this.state.hasWarning&&r.Append(" and ")),this.state.hasWarning&&(r.Append("".concat(this.state.currentWarnings.length)),r.Append(1==this.state.currentWarnings.length?" warning":"warnings"),this.state.hasWarning&&r.Append(" and ")),r.Append(". It is strongly suggested that you assign an error handler to story.onError. The first issue was: "),r.Append(this.state.hasError?this.state.currentErrors[0]:this.state.currentWarnings[0]),new x(r.toString())}if(this.state.hasError){var a,s=m(this.state.currentErrors);try{for(s.s();!(a=s.n()).done;){var o=a.value;this.onError(o,ct.Error);}}catch(o){s.e(o);}finally{s.f();}}if(this.state.hasWarning){var u,l=m(this.state.currentWarnings);try{for(l.s();!(u=l.n()).done;){var h=u.value;this.onError(h,ct.Warning);}}catch(o){l.e(o);}finally{l.f();}}this.ResetErrors();}}},{key:"ContinueSingleStep",value:function(){if(null!=this._profiler&&this._profiler.PreStep(),this.Step(),null!=this._profiler&&this._profiler.PostStep(),this.canContinue||this.state.callStack.elementIsEvaluateFromGame||this.TryFollowDefaultInvisibleChoice(),null!=this._profiler&&this._profiler.PreSnapshot(),!this.state.inStringEvaluation){if(null!==this._stateSnapshotAtLastNewline){if(null===this._stateSnapshotAtLastNewline.currentTags)return O("this._stateAtLastNewline.currentTags");if(null===this.state.currentTags)return O("this.state.currentTags");var t=this.CalculateNewlineOutputStateChange(this._stateSnapshotAtLastNewline.currentText,this.state.currentText,this._stateSnapshotAtLastNewline.currentTags.length,this.state.currentTags.length);if(t==s.OutputStateChange.ExtendedBeyondNewline||this._sawLookaheadUnsafeFunctionAfterNewline)return this.RestoreStateSnapshot(),!0;t==s.OutputStateChange.NewlineRemoved&&this.DiscardSnapshot();}this.state.outputStreamEndsInNewline&&(this.canContinue?null==this._stateSnapshotAtLastNewline&&this.StateSnapshot():this.DiscardSnapshot());}return null!=this._profiler&&this._profiler.PostSnapshot(),!1}},{key:"CalculateNewlineOutputStateChange",value:function(t,e,n,i){if(null===t)return O("prevText");if(null===e)return O("currText");var r=e.length>=t.length&&"\n"==e.charAt(t.length-1);if(n==i&&t.length==e.length&&r)return s.OutputStateChange.NoChange;if(!r)return s.OutputStateChange.NewlineRemoved;if(i>n)return s.OutputStateChange.ExtendedBeyondNewline;for(var a=t.length;a<e.length;a++){var o=e.charAt(a);if(" "!=o&&"\t"!=o)return s.OutputStateChange.ExtendedBeyondNewline}return s.OutputStateChange.NoChange}},{key:"ContinueMaximally",value:function(){this.IfAsyncWeCant("ContinueMaximally");for(var t=new N;this.canContinue;)t.Append(this.Continue());return t.toString()}},{key:"ContentAtPath",value:function(t){return this.mainContentContainer.ContentAtPath(t)}},{key:"KnotContainerWithName",value:function(t){var e=this.mainContentContainer.namedContent.get(t);return e instanceof q?e:null}},{key:"PointerAtPath",value:function(t){if(0==t.length)return H.Null;var e=new H,n=t.length,i=null;return null===t.lastComponent?O("path.lastComponent"):(t.lastComponent.isIndex?(n=t.length-1,i=this.mainContentContainer.ContentAtPath(t,void 0,n),e.container=i.container,e.index=t.lastComponent.index):(i=this.mainContentContainer.ContentAtPath(t),e.container=i.container,e.index=-1),null==i.obj||i.obj==this.mainContentContainer&&n>0?this.Error("Failed to find content at path '"+t+"', and no approximation of it was possible."):i.approximate&&this.Warning("Failed to find content at path '"+t+"', so it was approximated to: '"+i.obj.path+"'."),e)}},{key:"StateSnapshot",value:function(){this._stateSnapshotAtLastNewline=this._state,this._state=this._state.CopyAndStartPatching();}},{key:"RestoreStateSnapshot",value:function(){null===this._stateSnapshotAtLastNewline&&O("_stateSnapshotAtLastNewline"),this._stateSnapshotAtLastNewline.RestoreAfterPatch(),this._state=this._stateSnapshotAtLastNewline,this._stateSnapshotAtLastNewline=null,this._asyncSaving||this._state.ApplyAnyPatch();}},{key:"DiscardSnapshot",value:function(){this._asyncSaving||this._state.ApplyAnyPatch(),this._stateSnapshotAtLastNewline=null;}},{key:"CopyStateForBackgroundThreadSave",value:function(){if(this.IfAsyncWeCant("start saving on a background thread"),this._asyncSaving)throw new Error("Story is already in background saving mode, can't call CopyStateForBackgroundThreadSave again!");var t=this._state;return this._state=this._state.CopyAndStartPatching(),this._asyncSaving=!0,t}},{key:"BackgroundSaveComplete",value:function(){null===this._stateSnapshotAtLastNewline&&this._state.ApplyAnyPatch(),this._asyncSaving=!1;}},{key:"Step",value:function(){var t=!0,e=this.state.currentPointer.copy();if(!e.isNull){for(var n=k(e.Resolve(),q);n&&(this.VisitContainer(n,!0),0!=n.content.length);)n=k((e=H.StartOf(n)).Resolve(),q);this.state.currentPointer=e.copy(),null!=this._profiler&&this._profiler.Step(this.state.callStack);var i=e.Resolve(),r=this.PerformLogicAndFlowControl(i);if(!this.state.currentPointer.isNull){r&&(t=!1);var a=k(i,$);if(a){var s=this.ProcessChoice(a);s&&this.state.generatedChoices.push(s),i=null,t=!1;}if(i instanceof q&&(t=!1),t){var o=k(i,G);if(o&&-1==o.contextIndex){var u=this.state.callStack.ContextForVariableNamed(o.variableName);i=new G(o.variableName,u);}this.state.inExpressionEvaluation?this.state.PushEvaluationStack(i):this.state.PushToOutputStream(i);}this.NextContent();var l=k(i,z);l&&l.commandType==z.CommandType.StartThread&&this.state.callStack.PushThread();}}}},{key:"VisitContainer",value:function(t,e){t.countingAtStartOnly&&!e||(t.visitsShouldBeCounted&&this.state.IncrementVisitCountForContainer(t),t.turnIndexShouldBeCounted&&this.state.RecordTurnIndexVisitToContainer(t));}},{key:"VisitChangedContainersDueToDivert",value:function(){var t=this.state.previousPointer.copy(),e=this.state.currentPointer.copy();if(!e.isNull&&-1!=e.index){if(this._prevContainers.length=0,!t.isNull)for(var n=k(t.Resolve(),q)||k(t.container,q);n;)this._prevContainers.push(n),n=k(n.parent,q);var i=e.Resolve();if(null!=i)for(var r=k(i.parent,q),a=!0;r&&(this._prevContainers.indexOf(r)<0||r.countingAtStartOnly);){var s=r.content.length>0&&i==r.content[0]&&a;s||(a=!1),this.VisitContainer(r,s),i=r,r=k(r.parent,q);}}}},{key:"ProcessChoice",value:function(t){var e=!0;if(t.hasCondition){var n=this.state.PopEvaluationStack();this.IsTruthy(n)||(e=!1);}var i="",r="";t.hasChoiceOnlyContent&&(r=C(this.state.PopEvaluationStack(),D).value||"");t.hasStartContent&&(i=C(this.state.PopEvaluationStack(),D).value||"");t.onceOnly&&(this.state.VisitCountForContainer(t.choiceTarget)>0&&(e=!1));if(!e)return null;var a=new nt;return a.targetPath=t.pathOnChoice,a.sourcePath=t.path.toString(),a.isInvisibleDefault=t.isInvisibleDefault,a.threadAtGeneration=this.state.callStack.ForkThread(),a.text=(i+r).replace(/^[ \t]+|[ \t]+$/g,""),a}},{key:"IsTruthy",value:function(t){if(t instanceof V){var e=t;if(e instanceof B){var n=e;return this.Error("Shouldn't use a divert target (to "+n.targetPath+") as a conditional value. Did you intend a function call 'likeThis()' or a read count check 'likeThis'? (no arrows)"),!1}return e.isTruthy}return !1}},{key:"PerformLogicAndFlowControl",value:function(t){if(null==t)return !1;if(t instanceof X){var e=t;if(e.isConditional){var n=this.state.PopEvaluationStack();if(!this.IsTruthy(n))return !0}if(e.hasVariableTarget){var i=e.variableDivertName,r=this.state.variablesState.GetVariableWithName(i);if(null==r)this.Error("Tried to divert using a target from a variable that could not be found ("+i+")");else if(!(r instanceof B)){var a=k(r,R),s="Tried to divert to a target from a variable, but the variable ("+i+") didn't contain a divert target, it ";a instanceof R&&0==a.value?s+="was empty/null (the value 0).":s+="contained '"+r+"'.",this.Error(s);}var o=C(r,B);this.state.divertedPointer=this.PointerAtPath(o.targetPath);}else {if(e.isExternal)return this.CallExternalFunction(e.targetPathString,e.externalArgs),!0;this.state.divertedPointer=e.targetPointer.copy();}return e.pushesToStack&&this.state.callStack.Push(e.stackPushType,void 0,this.state.outputStream.length),this.state.divertedPointer.isNull&&!e.isExternal&&(e&&e.debugMetadata&&null!=e.debugMetadata.sourceName?this.Error("Divert target doesn't exist: "+e.debugMetadata.sourceName):this.Error("Divert resolution failed: "+e)),!0}if(t instanceof z){var u=t;switch(u.commandType){case z.CommandType.EvalStart:this.Assert(!1===this.state.inExpressionEvaluation,"Already in expression evaluation?"),this.state.inExpressionEvaluation=!0;break;case z.CommandType.EvalEnd:this.Assert(!0===this.state.inExpressionEvaluation,"Not in expression evaluation mode"),this.state.inExpressionEvaluation=!1;break;case z.CommandType.EvalOutput:if(this.state.evaluationStack.length>0){var l=this.state.PopEvaluationStack();if(!(l instanceof Z)){var h=new D(l.toString());this.state.PushToOutputStream(h);}}break;case z.CommandType.NoOp:break;case z.CommandType.Duplicate:this.state.PushEvaluationStack(this.state.PeekEvaluationStack());break;case z.CommandType.PopEvaluatedValue:this.state.PopEvaluationStack();break;case z.CommandType.PopFunction:case z.CommandType.PopTunnel:var c=u.commandType==z.CommandType.PopFunction?U.Function:U.Tunnel,f=null;if(c==U.Tunnel){var v=this.state.PopEvaluationStack();null===(f=k(v,B))&&this.Assert(v instanceof Z,"Expected void if ->-> doesn't override target");}if(this.state.TryExitFunctionEvaluationFromGame())break;if(this.state.callStack.currentElement.type==c&&this.state.callStack.canPop)this.state.PopCallStack(),f&&(this.state.divertedPointer=this.PointerAtPath(f.targetPath));else {var d=new Map;d.set(U.Function,"function return statement (~ return)"),d.set(U.Tunnel,"tunnel onwards statement (->->)");var p=d.get(this.state.callStack.currentElement.type);this.state.callStack.canPop||(p="end of flow (-> END or choice)");var y="Found "+d.get(c)+", when expected "+p;this.Error(y);}break;case z.CommandType.BeginString:this.state.PushToOutputStream(u),this.Assert(!0===this.state.inExpressionEvaluation,"Expected to be in an expression when evaluating a string"),this.state.inExpressionEvaluation=!1;break;case z.CommandType.EndString:for(var g=[],S=0,b=this.state.outputStream.length-1;b>=0;--b){var _=this.state.outputStream[b];S++;var w=k(_,z);if(w&&w.commandType==z.CommandType.BeginString)break;_ instanceof D&&g.push(_);}this.state.PopFromOutputStream(S),g=g.reverse();var T,E=new N,P=m(g);try{for(P.s();!(T=P.n()).done;){var F=T.value;E.Append(F.toString());}}catch(t){P.e(t);}finally{P.f();}this.state.inExpressionEvaluation=!0,this.state.PushEvaluationStack(new D(E.toString()));break;case z.CommandType.ChoiceCount:var W=this.state.generatedChoices.length;this.state.PushEvaluationStack(new R(W));break;case z.CommandType.Turns:this.state.PushEvaluationStack(new R(this.state.currentTurnIndex+1));break;case z.CommandType.TurnsSince:case z.CommandType.ReadCount:var L=this.state.PopEvaluationStack();if(!(L instanceof B)){var j="";L instanceof R&&(j=". Did you accidentally pass a read count ('knot_name') instead of a target ('-> knot_name')?"),this.Error("TURNS_SINCE / READ_COUNT expected a divert target (knot, stitch, label name), but saw "+L+j);break}var G,J=C(L,B),K=k(this.ContentAtPath(J.targetPath).correctObj,q);null!=K?G=u.commandType==z.CommandType.TurnsSince?this.state.TurnsSinceForContainer(K):this.state.VisitCountForContainer(K):(G=u.commandType==z.CommandType.TurnsSince?-1:0,this.Warning("Failed to find container for "+u.toString()+" lookup at "+J.targetPath.toString())),this.state.PushEvaluationStack(new R(G));break;case z.CommandType.Random:var $=k(this.state.PopEvaluationStack(),R),et=k(this.state.PopEvaluationStack(),R);if(null==et||et instanceof R==!1)return this.Error("Invalid value for minimum parameter of RANDOM(min, max)");if(null==$||et instanceof R==!1)return this.Error("Invalid value for maximum parameter of RANDOM(min, max)");if(null===$.value)return O("maxInt.value");if(null===et.value)return O("minInt.value");var nt=$.value-et.value+1;(!isFinite(nt)||nt>Number.MAX_SAFE_INTEGER)&&(nt=Number.MAX_SAFE_INTEGER,this.Error("RANDOM was called with a range that exceeds the size that ink numbers can use.")),nt<=0&&this.Error("RANDOM was called with minimum as "+et.value+" and maximum as "+$.value+". The maximum must be larger");var it=this.state.storySeed+this.state.previousRandom,rt=new ut(it).next(),at=rt%nt+et.value;this.state.PushEvaluationStack(new R(at)),this.state.previousRandom=rt;break;case z.CommandType.SeedRandom:var st=k(this.state.PopEvaluationStack(),R);if(null==st||st instanceof R==!1)return this.Error("Invalid value passed to SEED_RANDOM");if(null===st.value)return O("minInt.value");this.state.storySeed=st.value,this.state.previousRandom=0,this.state.PushEvaluationStack(new Z);break;case z.CommandType.VisitIndex:var ot=this.state.VisitCountForContainer(this.state.currentPointer.container)-1;this.state.PushEvaluationStack(new R(ot));break;case z.CommandType.SequenceShuffleIndex:var lt=this.NextSequenceShuffleIndex();this.state.PushEvaluationStack(new R(lt));break;case z.CommandType.StartThread:break;case z.CommandType.Done:this.state.callStack.canPopThread?this.state.callStack.PopThread():(this.state.didSafeExit=!0,this.state.currentPointer=H.Null);break;case z.CommandType.End:this.state.ForceEnd();break;case z.CommandType.ListFromInt:var ht=k(this.state.PopEvaluationStack(),R),ct=C(this.state.PopEvaluationStack(),D);if(null===ht)throw new x("Passed non-integer when creating a list element from a numerical value.");var ft=null;if(null===this.listDefinitions)return O("this.listDefinitions");var vt=this.listDefinitions.TryListGetDefinition(ct.value,null);if(!vt.exists)throw new x("Failed to find LIST called "+ct.value);if(null===ht.value)return O("minInt.value");var dt=vt.result.TryGetItemWithValue(ht.value,A.Null);dt.exists&&(ft=new M(dt.result,ht.value)),null==ft&&(ft=new M),this.state.PushEvaluationStack(ft);break;case z.CommandType.ListRange:var pt=k(this.state.PopEvaluationStack(),V),yt=k(this.state.PopEvaluationStack(),V),mt=k(this.state.PopEvaluationStack(),M);if(null===mt||null===yt||null===pt)throw new x("Expected list, minimum and maximum for LIST_RANGE");if(null===mt.value)return O("targetList.value");var gt=mt.value.ListWithSubRange(yt.valueObject,pt.valueObject);this.state.PushEvaluationStack(new M(gt));break;case z.CommandType.ListRandom:var St=this.state.PopEvaluationStack();if(null===St)throw new x("Expected list for LIST_RANDOM");var kt=St.value,Ct=null;if(null===kt)throw O("list");if(0==kt.Count)Ct=new I;else {for(var bt=this.state.storySeed+this.state.previousRandom,_t=new ut(bt).next(),wt=_t%kt.Count,Tt=kt.entries(),Et=0;Et<=wt-1;Et++)Tt.next();var Ot=Tt.next().value,Pt={Key:A.fromSerializedKey(Ot[0]),Value:Ot[1]};if(null===Pt.Key.originName)return O("randomItem.Key.originName");(Ct=new I(Pt.Key.originName,this)).Add(Pt.Key,Pt.Value),this.state.previousRandom=_t;}this.state.PushEvaluationStack(new M(Ct));break;default:this.Error("unhandled ControlCommand: "+u);}return !0}if(t instanceof Q){var Nt=t,At=this.state.PopEvaluationStack();return this.state.variablesState.Assign(Nt,At),!0}if(t instanceof Y){var It=t,xt=null;if(null!=It.pathForCount){var Ft=It.containerForCount,Wt=this.state.VisitCountForContainer(Ft);xt=new R(Wt);}else null==(xt=this.state.variablesState.GetVariableWithName(It.name))&&(this.Warning("Variable not found: '"+It.name+"'. Using default value of 0 (false). This can happen with temporary variables if the declaration hasn't yet been hit. Globals are always given a default value on load if a value doesn't exist in the save state."),xt=new R(0));return this.state.PushEvaluationStack(xt),!0}if(t instanceof tt){var Vt=t,Lt=this.state.PopEvaluationStack(Vt.numberOfParameters),Rt=Vt.Call(Lt);return this.state.PushEvaluationStack(Rt),!0}return !1}},{key:"ChoosePathString",value:function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];if(this.IfAsyncWeCant("call ChoosePathString right now"),null!==this.onChoosePathString&&this.onChoosePathString(t,n),e)this.ResetCallstack();else if(this.state.callStack.currentElement.type==U.Function){var i="",r=this.state.callStack.currentElement.currentPointer.container;throw null!=r&&(i="("+r.path.toString()+") "),new Error("Story was running a function "+i+"when you called ChoosePathString("+t+") - this is almost certainly not not what you want! Full stack trace: \n"+this.state.callStack.callStackTrace)}this.state.PassArgumentsToEvaluationStack(n),this.ChoosePath(new S(t));}},{key:"IfAsyncWeCant",value:function(t){if(this._asyncContinueActive)throw new Error("Can't "+t+". Story is in the middle of a ContinueAsync(). Make more ContinueAsync() calls or a single Continue() call beforehand.")}},{key:"ChoosePath",value:function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];this.state.SetChosenPath(t,e),this.VisitChangedContainersDueToDivert();}},{key:"ChooseChoiceIndex",value:function(t){t=t;var e=this.currentChoices;this.Assert(t>=0&&t<e.length,"choice out of range");var n=e[t];return null!==this.onMakeChoice&&this.onMakeChoice(n),null===n.threadAtGeneration?O("choiceToChoose.threadAtGeneration"):null===n.targetPath?O("choiceToChoose.targetPath"):(this.state.callStack.currentThread=n.threadAtGeneration,void this.ChoosePath(n.targetPath))}},{key:"HasFunction",value:function(t){try{return null!=this.KnotContainerWithName(t)}catch(t){return !1}}},{key:"EvaluateFunction",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(null!==this.onEvaluateFunction&&this.onEvaluateFunction(t,e),this.IfAsyncWeCant("evaluate a function"),null==t)throw new Error("Function is null");if(""==t||""==t.trim())throw new Error("Function is empty or white space.");var i=this.KnotContainerWithName(t);if(null==i)throw new Error("Function doesn't exist: '"+t+"'");var r=[];r.push.apply(r,d(this.state.outputStream)),this._state.ResetOutput(),this.state.StartFunctionEvaluationFromGame(i,e);for(var a=new N;this.canContinue;)a.Append(this.Continue());var s=a.toString();this._state.ResetOutput(r);var o=this.state.CompleteFunctionEvaluationFromGame();return null!=this.onCompleteEvaluateFunction&&this.onCompleteEvaluateFunction(t,e,s,o),n?{returned:o,output:s}:o}},{key:"EvaluateExpression",value:function(t){var e=this.state.callStack.elements.length;this.state.callStack.Push(U.Tunnel),this._temporaryEvaluationContainer=t,this.state.GoToStart();var n=this.state.evaluationStack.length;return this.Continue(),this._temporaryEvaluationContainer=null,this.state.callStack.elements.length>e&&this.state.PopCallStack(),this.state.evaluationStack.length>n?this.state.PopEvaluationStack():null}},{key:"CallExternalFunction",value:function(t,n){if(null===t)return O("funcName");var i=this._externals.get(t),r=null,a=void 0!==i;if(!a||i.lookAheadSafe||null===this._stateSnapshotAtLastNewline){if(!a){if(this.allowExternalFunctionFallbacks)return r=this.KnotContainerWithName(t),this.Assert(null!==r,"Trying to call EXTERNAL function '"+t+"' which has not been bound, and fallback ink function could not be found."),this.state.callStack.Push(U.Function,void 0,this.state.outputStream.length),void(this.state.divertedPointer=H.StartOf(r));this.Assert(!1,"Trying to call EXTERNAL function '"+t+"' which has not been bound (and ink fallbacks disabled).");}for(var s=[],o=0;o<n;++o){var u=C(this.state.PopEvaluationStack(),V).valueObject;s.push(u);}s.reverse();var l=i.function(s),h=null;null!=l?(h=V.Create(l),this.Assert(null!==h,"Could not create ink value from returned object of type "+e(l))):h=new Z,this.state.PushEvaluationStack(h);}else this._sawLookaheadUnsafeFunctionAfterNewline=!0;}},{key:"BindExternalFunctionGeneral",value:function(t,e,n){this.IfAsyncWeCant("bind an external function"),this.Assert(!this._externals.has(t),"Function '"+t+"' has already been bound."),this._externals.set(t,{function:e,lookAheadSafe:n});}},{key:"TryCoerce",value:function(t){return t}},{key:"BindExternalFunction",value:function(t,e,n){var i=this;this.Assert(null!=e,"Can't bind a null function"),this.BindExternalFunctionGeneral(t,(function(t){i.Assert(t.length>=e.length,"External function expected "+e.length+" arguments");for(var n=[],r=0,a=t.length;r<a;r++)n[r]=i.TryCoerce(t[r]);return e.apply(null,n)}),n);}},{key:"UnbindExternalFunction",value:function(t){this.IfAsyncWeCant("unbind an external a function"),this.Assert(this._externals.has(t),"Function '"+t+"' has not been bound."),this._externals.delete(t);}},{key:"ValidateExternalBindings",value:function(){var t=null,e=null,n=arguments[1]||new Set;if(arguments[0]instanceof q&&(t=arguments[0]),arguments[0]instanceof P&&(e=arguments[0]),null===t&&null===e)if(this.ValidateExternalBindings(this._mainContentContainer,n),this._hasValidatedExternals=!0,0==n.size)this._hasValidatedExternals=!0;else {var i="Error: Missing function binding for external";i+=n.size>1?"s":"",i+=": '",i+=Array.from(n).join("', '"),i+="' ",i+=this.allowExternalFunctionFallbacks?", and no fallback ink function found.":" (ink fallbacks disabled)",this.Error(i);}else if(null!=t){var r,a=m(t.content);try{for(a.s();!(r=a.n()).done;){var s=r.value,o=s;null!=o&&o.hasValidName||this.ValidateExternalBindings(s,n);}}catch(t){a.e(t);}finally{a.f();}var u,l=m(t.namedContent);try{for(l.s();!(u=l.n()).done;){var h=v(u.value,2),c=h[1];this.ValidateExternalBindings(k(c,P),n);}}catch(t){l.e(t);}finally{l.f();}}else if(null!=e){var f=k(e,X);if(f&&f.isExternal){var d=f.targetPathString;if(null===d)return O("name");if(!this._externals.has(d))if(this.allowExternalFunctionFallbacks){var p=this.mainContentContainer.namedContent.has(d);p||n.add(d);}else n.add(d);}}}},{key:"ObserveVariable",value:function(t,e){if(this.IfAsyncWeCant("observe a new variable"),null===this._variableObservers&&(this._variableObservers=new Map),!this.state.variablesState.GlobalVariableExistsWithName(t))throw new Error("Cannot observe variable '"+t+"' because it wasn't declared in the ink story.");this._variableObservers.has(t)?this._variableObservers.get(t).push(e):this._variableObservers.set(t,[e]);}},{key:"ObserveVariables",value:function(t,e){for(var n=0,i=t.length;n<i;n++)this.ObserveVariable(t[n],e[n]);}},{key:"RemoveVariableObserver",value:function(t,e){if(this.IfAsyncWeCant("remove a variable observer"),null!==this._variableObservers)if(null!=e){if(this._variableObservers.has(e))if(null!=t){var n=this._variableObservers.get(e);null!=n&&(n.splice(n.indexOf(t),1),0===n.length&&this._variableObservers.delete(e));}else this._variableObservers.delete(e);}else if(null!=t){var i,r=m(this._variableObservers.keys());try{for(r.s();!(i=r.n()).done;){var a=i.value,s=this._variableObservers.get(a);null!=s&&(s.splice(s.indexOf(t),1),0===s.length&&this._variableObservers.delete(a));}}catch(t){r.e(t);}finally{r.f();}}}},{key:"VariableStateDidChangeEvent",value:function(t,e){if(null!==this._variableObservers){var n=this._variableObservers.get(t);if(void 0!==n){if(!(e instanceof V))throw new Error("Tried to get the value of a variable that isn't a standard type");var i,r=C(e,V),a=m(n);try{for(a.s();!(i=a.n()).done;){(0,i.value)(t,r.valueObject);}}catch(t){a.e(t);}finally{a.f();}}}}},{key:"globalTags",get:function(){return this.TagsAtStartOfFlowContainerWithPathString("")}},{key:"TagsForContentAtPath",value:function(t){return this.TagsAtStartOfFlowContainerWithPathString(t)}},{key:"TagsAtStartOfFlowContainerWithPathString",value:function(t){var e=new S(t),n=this.ContentAtPath(e).container;if(null===n)return O("flowContainer");for(;;){var i=n.content[0];if(!(i instanceof q))break;n=i;}var r,a=null,s=m(n.content);try{for(s.s();!(r=s.n()).done;){var o=k(r.value,et);if(!o)break;null==a&&(a=[]),a.push(o.text);}}catch(t){s.e(t);}finally{s.f();}return a}},{key:"BuildStringOfHierarchy",value:function(){var t=new N;return this.mainContentContainer.BuildStringOfHierarchy(t,0,this.state.currentPointer.Resolve()),t.toString()}},{key:"BuildStringOfContainer",value:function(t){var e=new N;return t.BuildStringOfHierarchy(e,0,this.state.currentPointer.Resolve()),e.toString()}},{key:"NextContent",value:function(){if((this.state.previousPointer=this.state.currentPointer.copy(),this.state.divertedPointer.isNull||(this.state.currentPointer=this.state.divertedPointer.copy(),this.state.divertedPointer=H.Null,this.VisitChangedContainersDueToDivert(),this.state.currentPointer.isNull))&&!this.IncrementContentPointer()){var t=!1;this.state.callStack.CanPop(U.Function)?(this.state.PopCallStack(U.Function),this.state.inExpressionEvaluation&&this.state.PushEvaluationStack(new Z),t=!0):this.state.callStack.canPopThread?(this.state.callStack.PopThread(),t=!0):this.state.TryExitFunctionEvaluationFromGame(),t&&!this.state.currentPointer.isNull&&this.NextContent();}}},{key:"IncrementContentPointer",value:function(){var t=!0,e=this.state.callStack.currentElement.currentPointer.copy();if(e.index++,null===e.container)return O("pointer.container");for(;e.index>=e.container.content.length;){t=!1;var n=k(e.container.parent,q);if(n instanceof q==!1)break;var i=n.content.indexOf(e.container);if(-1==i)break;if((e=new H(n,i)).index++,t=!0,null===e.container)return O("pointer.container")}return t||(e=H.Null),this.state.callStack.currentElement.currentPointer=e.copy(),t}},{key:"TryFollowDefaultInvisibleChoice",value:function(){var t=this._state.currentChoices,e=t.filter((function(t){return t.isInvisibleDefault}));if(0==e.length||t.length>e.length)return !1;var n=e[0];return null===n.targetPath?O("choice.targetPath"):null===n.threadAtGeneration?O("choice.threadAtGeneration"):(this.state.callStack.currentThread=n.threadAtGeneration,null!==this._stateSnapshotAtLastNewline&&(this.state.callStack.currentThread=this.state.callStack.ForkThread()),this.ChoosePath(n.targetPath,!1),!0)}},{key:"NextSequenceShuffleIndex",value:function(){var t=k(this.state.PopEvaluationStack(),R);if(!(t instanceof R))return this.Error("expected number of elements in sequence for shuffle index"),0;var e=this.state.currentPointer.container;if(null===e)return O("seqContainer");if(null===t.value)return O("numElementsIntVal.value");var n=t.value,i=C(this.state.PopEvaluationStack(),R).value;if(null===i)return O("seqCount");for(var r=i/n,a=i%n,s=e.path.toString(),o=0,u=0,l=s.length;u<l;u++)o+=s.charCodeAt(u)||0;for(var h=o+r+this.state.storySeed,c=new ut(Math.floor(h)),f=[],v=0;v<n;++v)f.push(v);for(var d=0;d<=a;++d){var p=c.next()%f.length,y=f[p];if(f.splice(p,1),d==a)return y}throw new Error("Should never reach here")}},{key:"Error",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=new x(t);throw n.useEndLineNumber=e,n}},{key:"Warning",value:function(t){this.AddError(t,!0);}},{key:"AddError",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=this.currentDebugMetadata,r=e?"WARNING":"ERROR";if(null!=i){var a=n?i.endLineNumber:i.startLineNumber;t="RUNTIME "+r+": '"+i.fileName+"' line "+a+": "+t;}else t=this.state.currentPointer.isNull?"RUNTIME "+r+": "+t:"RUNTIME "+r+": ("+this.state.currentPointer+"): "+t;this.state.AddError(t,e),e||this.state.ForceEnd();}},{key:"Assert",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;if(0==t)throw null==e&&(e="Story assert"),new Error(e+" "+this.currentDebugMetadata)}},{key:"currentDebugMetadata",get:function(){var t,e=this.state.currentPointer;if(!e.isNull&&null!==e.Resolve()&&null!==(t=e.Resolve().debugMetadata))return t;for(var n=this.state.callStack.elements.length-1;n>=0;--n)if(!(e=this.state.callStack.elements[n].currentPointer).isNull&&null!==e.Resolve()&&null!==(t=e.Resolve().debugMetadata))return t;for(var i=this.state.outputStream.length-1;i>=0;--i){if(null!==(t=this.state.outputStream[i].debugMetadata))return t}return null}},{key:"mainContentContainer",get:function(){return this._temporaryEvaluationContainer?this._temporaryEvaluationContainer:this._mainContentContainer}}]),s}(P),t.Story.inkVersionCurrent=20,ft=t.Story||(t.Story={}),(vt=ft.OutputStateChange||(ft.OutputStateChange={}))[vt.NoChange=0]="NoChange",vt[vt.ExtendedBeyondNewline=1]="ExtendedBeyondNewline",vt[vt.NewlineRemoved=2]="NewlineRemoved",t.InkList=I,Object.defineProperty(t,"__esModule",{value:!0});}));

    });

    var Ink = /*@__PURE__*/getDefaultExportFromCjs(ink);

    var storyJson = "﻿{\"inkVersion\":20,\"root\":[[\"^The year is 2050. You look outside your window and see...\",\"\\n\",[\"ev\",{\"^->\":\"0.2.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\"0.c-0\",\"flg\":18},{\"s\":[\"^People wearing gasmasks, standing in line to get more food rations.\",{\"->\":\"$r\",\"var\":true},null]}],[\"ev\",{\"^->\":\"0.3.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\"0.c-1\",\"flg\":18},{\"s\":[\"^Factories keeping the world together to sustain the consumerist lifestyles.\",{\"->\":\"$r\",\"var\":true},null]}],[\"ev\",{\"^->\":\"0.4.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\"0.c-2\",\"flg\":18},{\"s\":[\"^A green oasis with children joyfully playing outside.\",{\"->\":\"$r\",\"var\":true},null]}],{\"c-0\":[\"ev\",{\"^->\":\"0.c-0.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\"0.2.s\"},[{\"#n\":\"$r2\"}],\"\\n\",\"^You live in a world completely destroyed by a local factory. Your last food source has been destroyed by the pollution of this building. You have no other options for food anymore to survive.\",\"\\n\",\"^You have the option to destroy the factory to possibly save your the food source of your community. But this mean that the big part of the community will lose their job and bring possibly even more people hunger. If you can't create a new food source.\",\"\\n\",[[\"ev\",{\"^->\":\"0.c-0.11.0.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-0\",\"flg\":18},{\"s\":[\"^Don't destroy it.\",{\"->\":\"$r\",\"var\":true},null]}],[\"ev\",{\"^->\":\"0.c-0.11.1.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-1\",\"flg\":18},{\"s\":[\"^Destroy it.\",{\"->\":\"$r\",\"var\":true},null]}],{\"c-0\":[\"ev\",{\"^->\":\"0.c-0.11.c-0.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.0.s\"},[{\"#n\":\"$r2\"}],\"\\n\",\"^You didn't destroy the factory. Your neighbours and family ask, \\\"WHY DIDN'T YOU DESTROY THE FACTORY? NOW WE ARE SURLY DOOMED\\\".\",\"\\n\",[[\"ev\",{\"^->\":\"0.c-0.11.c-0.9.0.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-0\",\"flg\":18},{\"s\":[\"^It would have been a selfish act harming more people\",{\"->\":\"$r\",\"var\":true},null]}],[\"ev\",{\"^->\":\"0.c-0.11.c-0.9.1.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-1\",\"flg\":18},{\"s\":[\"^I didn't know any better\",{\"->\":\"$r\",\"var\":true},null]}],[\"ev\",{\"^->\":\"0.c-0.11.c-0.9.2.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-2\",\"flg\":18},{\"s\":[\"^Other\",{\"->\":\"$r\",\"var\":true},null]}],{\"c-0\":[\"ev\",{\"^->\":\"0.c-0.11.c-0.9.c-0.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.0.s\"},[{\"#n\":\"$r2\"}],\"\\n\",{\"->\":\"factoryNotDestroyed\"},{\"->\":\"0.g-0\"},{\"#f\":5}],\"c-1\":[\"ev\",{\"^->\":\"0.c-0.11.c-0.9.c-1.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.1.s\"},[{\"#n\":\"$r2\"}],\"\\n\",{\"->\":\"factoryNotDestroyed\"},{\"->\":\"0.g-0\"},{\"#f\":5}],\"c-2\":[\"ev\",{\"^->\":\"0.c-0.11.c-0.9.c-2.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.2.s\"},[{\"#n\":\"$r2\"}],\"\\n\",{\"->\":\"factoryNotDestroyed\"},{\"->\":\"0.g-0\"},{\"#f\":5}]}],{\"#f\":5}],\"c-1\":[\"ev\",{\"^->\":\"0.c-0.11.c-1.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.1.s\"},[{\"#n\":\"$r2\"}],\"\\n\",{\"->\":\"destroyFactory\"},{\"->\":\"0.g-0\"},{\"#f\":5}]}],{\"#f\":5}],\"c-1\":[\"ev\",{\"^->\":\"0.c-1.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\"0.3.s\"},[{\"#n\":\"$r2\"}],\"\\n\",\"^You live in a world depended on local factories. You happen to work at one of these factories, which provides you with just enough income to live. However, your factory is a major pollutant for its environment and people living nearby are not able to grow any crops which is causing them to starve.\",\"\\n\",\"^You have the option to close the factory out of empathy for the neighboring community that are affected by the pollution. Or you can keep the factory open to keep supporting you own small community of factory workers.\",\"\\n\",[[\"ev\",{\"^->\":\"0.c-1.11.0.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-0\",\"flg\":18},{\"s\":[\"^Close it.\",{\"->\":\"$r\",\"var\":true},null]}],[\"ev\",{\"^->\":\"0.c-1.11.1.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-1\",\"flg\":18},{\"s\":[\"^Keep it open.\",{\"->\":\"$r\",\"var\":true},null]}],{\"c-0\":[\"ev\",{\"^->\":\"0.c-1.11.c-0.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.0.s\"},[{\"#n\":\"$r2\"}],\"\\n\",{\"->\":\"destroyFactory\"},{\"->\":\"0.g-0\"},{\"#f\":5}],\"c-1\":[\"ev\",{\"^->\":\"0.c-1.11.c-1.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.1.s\"},[{\"#n\":\"$r2\"}],\"\\n\",{\"->\":\"keepFactoryOpen\"},{\"->\":\"0.g-0\"},{\"#f\":5}]}],{\"#f\":5}],\"c-2\":[\"ev\",{\"^->\":\"0.c-2.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\"0.4.s\"},[{\"#n\":\"$r2\"}],\"\\n\",\"^You live in a world defined by luxury and pleasure, and you haven't experienced much difficulty in your life. You live in a paradise surrounded by walls, seperating you from other classes. Your pleasure comes at the cost of others and you have a lot of influence in deciding the future.\",\"\\n\",\"^You hear news of an investment opportunity that is coming up. You can invest in a factory of a lower class community, which could allow for their community to become more self-sustaining. Your other option is to invest more in upcoming fusion reactor developments, which could boost your own community's energy production exponentially.\",\"\\n\",[[\"ev\",{\"^->\":\"0.c-2.11.0.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"str\",\"^in neighboring community\",\"/str\",\"/ev\",{\"*\":\".^.^.c-0\",\"flg\":22},{\"s\":[\"^Invest \",{\"->\":\"$r\",\"var\":true},null]}],[\"ev\",{\"^->\":\"0.c-2.11.1.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"str\",\"^in our community\",\"/str\",\"/ev\",{\"*\":\".^.^.c-1\",\"flg\":22},{\"s\":[\"^Invest \",{\"->\":\"$r\",\"var\":true},null]}],{\"c-0\":[\"ev\",{\"^->\":\"0.c-2.11.c-0.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.0.s\"},[{\"#n\":\"$r2\"}],\"^ in the neighboring lower class community.\",\"\\n\",{\"->\":\"investInFactory\"},{\"->\":\"0.g-0\"},{\"#f\":5}],\"c-1\":[\"ev\",{\"^->\":\"0.c-2.11.c-1.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.1.s\"},[{\"#n\":\"$r2\"}],\"^ in the upcoming fusion reactor developments. \",\"\\n\",{\"->\":\"investInCommunity\"},{\"->\":\"0.g-0\"},{\"#f\":5}]}],{\"#f\":5}],\"g-0\":[\"done\",{\"#f\":5}]}],\"done\",{\"factoryNotDestroyed\":[\"^Over the upcoming days you try to come up with different food sources. But nothing works. You desperately you move to the bigger city to try and ask them for help.\",\"\\n\",{\"->\":\"flee\"},{\"#f\":1}],\"destroyFactory\":[[\"^The factory is now gone. Now the world has less pollution and you might by able to create a new form of food and income for your community. However you now must provide for a lot more people who were depended on the factory. They are angry at you and demand an explanation and reasoning as to why you destroyed their lives.\",\"\\n\",[\"ev\",{\"^->\":\"destroyFactory.0.2.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-0\",\"flg\":18},{\"s\":[\"^\\\"Sometimes you got to make sacrificies to make our world a better place.\\\"\",{\"->\":\"$r\",\"var\":true},null]}],[\"ev\",{\"^->\":\"destroyFactory.0.3.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-1\",\"flg\":18},{\"s\":[\"^\\\"I had no choice! Otherwise, I had no food for myself and my community.\\\"\",{\"->\":\"$r\",\"var\":true},null]}],{\"c-0\":[\"ev\",{\"^->\":\"destroyFactory.0.c-0.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.2.s\"},[{\"#n\":\"$r2\"}],\"\\n\",{\"->\":\"newLife\"},{\"#f\":5}],\"c-1\":[\"ev\",{\"^->\":\"destroyFactory.0.c-1.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.3.s\"},[{\"#n\":\"$r2\"}],\"\\n\",{\"->\":\"newLife\"},{\"#f\":5}]}],{\"#f\":1}],\"keepFactoryOpen\":[[\"^You keep the factory open. You are still able to barely support your own community. But the land of your neighbors next to you is completely destroyed and they have nothing left. You know some of the people there and you get messages with the question of why you didn't close the factory\",\"\\n\",[\"ev\",{\"^->\":\"keepFactoryOpen.0.2.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-0\",\"flg\":18},{\"s\":[\"^\\\"I have to support my own community first. I can't risk getting more people in trouble.\\\"\",{\"->\":\"$r\",\"var\":true},null]}],[\"ev\",{\"^->\":\"keepFactoryOpen.0.3.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-1\",\"flg\":18},{\"s\":[\"^\\\"Otherwise these people will never learn how to be autonomous like us.\\\"\",{\"->\":\"$r\",\"var\":true},null]}],{\"c-0\":[\"ev\",{\"^->\":\"keepFactoryOpen.0.c-0.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.2.s\"},[{\"#n\":\"$r2\"}],\"\\n\",{\"->\":\"promotion\"},{\"#f\":5}],\"c-1\":[\"ev\",{\"^->\":\"keepFactoryOpen.0.c-1.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.3.s\"},[{\"#n\":\"$r2\"}],\"\\n\",{\"->\":\"promotion\"},{\"#f\":5}]}],{\"#f\":1}],\"promotion\":[[\"^Things are going well in the factory and you have been promoted to the executive board. There is a new budget and you get to decide how it should be spend. You have the option of helping out your neighbours by investing in soil fertility repairment, or you can upgrade the factory which would increase the production that could sustain the food needs of the whole community.\",\"\\n\",[\"ev\",{\"^->\":\"promotion.0.2.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-0\",\"flg\":18},{\"s\":[\"^Invest in the soil fertility program.\",{\"->\":\"$r\",\"var\":true},null]}],[\"ev\",{\"^->\":\"promotion.0.3.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-1\",\"flg\":18},{\"s\":[\"^Upgrade the production.\",{\"->\":\"$r\",\"var\":true},null]}],{\"c-0\":[\"ev\",{\"^->\":\"promotion.0.c-0.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.2.s\"},[{\"#n\":\"$r2\"}],\"\\n\",{\"->\":\"rebuild\"},{\"#f\":5}],\"c-1\":[\"ev\",{\"^->\":\"promotion.0.c-1.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.3.s\"},[{\"#n\":\"$r2\"}],\"\\n\",{\"->\":\"upgrade\"},{\"#f\":5}]}],{\"#f\":1}],\"newLife\":[\"^Over the upcoming days you try to come up with new food sources. You can stay with your community to try and improve your life there by slowly trying to rebuild food and production, with a possible chance of failure. Or you can move to the big city and try to rebuild your life there with your community. This requires everyone to abandon there lives.\",\"\\n\",[[\"ev\",{\"^->\":\"newLife.2.0.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-0\",\"flg\":18},{\"s\":[\"^Rebuild from the ground up.\",{\"->\":\"$r\",\"var\":true},null]}],[\"ev\",{\"^->\":\"newLife.2.1.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-1\",\"flg\":18},{\"s\":[\"^Seek a new life in the big city.\",{\"->\":\"$r\",\"var\":true},null]}],{\"c-0\":[\"ev\",{\"^->\":\"newLife.2.c-0.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.0.s\"},[{\"#n\":\"$r2\"}],\"\\n\",{\"->\":\"rebuild\"},{\"#f\":5}],\"c-1\":[\"ev\",{\"^->\":\"newLife.2.c-1.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.1.s\"},[{\"#n\":\"$r2\"}],\"\\n\",{\"->\":\"flee\"},{\"#f\":5}]}],{\"#f\":1}],\"investInCommunity\":[[\"^Your investment turned out to be a great succes, and the energy production of your community has sky rocketed. Some people are complaining though about the stench that is coming over the wall of your community. Some argue that an investment in the factory would have been a better option. Yet you argue that...\",\"\\n\",[\"ev\",{\"^->\":\"investInCommunity.0.2.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-0\",\"flg\":18},{\"s\":[\"^\\\"Its better to fix your own problems first before you try to fix that of others.\\\"\",{\"->\":\"$r\",\"var\":true},null]}],[\"ev\",{\"^->\":\"investInCommunity.0.3.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-1\",\"flg\":18},{\"s\":[\"^\\\"The other community needs to learn how to be autonomous, which they have to achieve without external aid.\\\"\",{\"->\":\"$r\",\"var\":true},null]}],{\"c-0\":[\"ev\",{\"^->\":\"investInCommunity.0.c-0.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.2.s\"},[{\"#n\":\"$r2\"}],\"\\n\",{\"->\":\"utopia\"},{\"#f\":5}],\"c-1\":[\"ev\",{\"^->\":\"investInCommunity.0.c-1.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.3.s\"},[{\"#n\":\"$r2\"}],\"\\n\",{\"->\":\"utopia\"},{\"#f\":5}]}],{\"#f\":1}],\"utopia\":[\"^You are able to maintain an utopian community. Chaos does seem to be present over the walls of your paradise, yet it doesn't really affect your quality of life. You and your peers have come to a consensus that these  external problems will have to be fixed by themselves, which is just a matter of time.\",\"\\n\",{\"->\":\"focusOnYourself\"},\"end\",{\"#f\":1}],\"investInFactory\":[[\"^You invest in the factory of the neighboring community. They are grateful for your help, Your own community is dissatisfied with your choice. You are wealthy but still have lots of other problems that require investing. They demand to know why you refuse to fix your own communities problems first.\",\"\\n\",[\"ev\",{\"^->\":\"investInFactory.0.2.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-0\",\"flg\":18},{\"s\":[\"^\\\"We are wealthy enough the try and help others to achieve the same level of wealth. Maybe we can use them in the future to trade with.\\\"\",{\"->\":\"$r\",\"var\":true},null]}],[\"ev\",{\"^->\":\"investInFactory.0.3.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-1\",\"flg\":18},{\"s\":[\"^\\\"We have to show good will to other from time to time. In the future we will focus more on our selves again.\\\"\",{\"->\":\"$r\",\"var\":true},null]}],{\"c-0\":[\"ev\",{\"^->\":\"investInFactory.0.c-0.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.2.s\"},[{\"#n\":\"$r2\"}],\"\\n\",{\"->\":\"afterInvestingInFactory\"},{\"#f\":5}],\"c-1\":[\"ev\",{\"^->\":\"investInFactory.0.c-1.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.3.s\"},[{\"#n\":\"$r2\"}],\"\\n\",{\"->\":\"afterInvestingInFactory\"},{\"#f\":5}]}],{\"#f\":1}],\"afterInvestingInFactory\":[[\"^After you invested you hear that the other community wants even more money and resources from you. They can't keep up them selves and need you to keep supporting them more and more. You realize they have become dependent on you. You can chose to keep investing in them or pull all the funds from them.\",\"\\n\",[\"ev\",{\"^->\":\"afterInvestingInFactory.0.2.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-0\",\"flg\":18},{\"s\":[\"^Keep investing\",{\"->\":\"$r\",\"var\":true},null]}],[\"ev\",{\"^->\":\"afterInvestingInFactory.0.3.$r1\"},{\"temp=\":\"$r\"},\"str\",{\"->\":\".^.s\"},[{\"#n\":\"$r1\"}],\"/str\",\"/ev\",{\"*\":\".^.^.c-1\",\"flg\":18},{\"s\":[\"^Pull all funds\",{\"->\":\"$r\",\"var\":true},null]}],{\"c-0\":[\"ev\",{\"^->\":\"afterInvestingInFactory.0.c-0.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.2.s\"},[{\"#n\":\"$r2\"}],\"\\n\",{\"->\":\"upgrade\"},{\"#f\":5}],\"c-1\":[\"ev\",{\"^->\":\"afterInvestingInFactory.0.c-1.$r2\"},\"/ev\",{\"temp=\":\"$r\"},{\"->\":\".^.^.3.s\"},[{\"#n\":\"$r2\"}],\"\\n\",{\"->\":\"focusOnYourself\"},{\"#f\":5}]}],{\"#f\":1}],\"flee\":[\"^When you arrive at the gates of the big cities, you must plead your case before the others will let you in. You have tried everything but it seems that the city has no place for you.\",\"\\n\",\"end\",{\"#f\":1}],\"rebuild\":[\"^You work hard to get your community to a better place. Your situation somewhat stabilizes more and your can support your own community a little bit better with improved living conditions and overall wealth. You are still not risk free. but you have learned that it is possible to improve a situation with a little investment. With this new perspective you decide to meet with the other leaders, to try and convince them that you could build a better world for all to live in.\",\"\\n\",\"end\",{\"#f\":1}],\"upgrade\":[\"^You invest again in the community. You see the effect your actions have on a lower community. It did however cost some of your own progress. But the world is a bit easier to live in for them. You decide to meet with the other community leaders to discuss your actions.\",\"\\n\",\"end\",{\"#f\":1}],\"focusOnYourself\":[\"^The other communities outside your city walls are destroyed. They were not able to sustain or rebuild themselves. They come knocking at your city walls asking for help. You don't know what decisions they have made that lead them to that situation. Maybe they destroyed themselves or maybe you caused their misfortune. But now a stream of refugees is headed towards your city.\",\"\\n\",\"end\",\"end\",{\"#f\":1}],\"#f\":1}],\"listDefs\":{}}";

    /* src\App.svelte generated by Svelte v3.50.1 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let script;
    	let script_src_value;
    	let t0;
    	let main;
    	let intro;
    	let t1;
    	let footer;
    	let current;
    	let mounted;
    	let dispose;

    	intro = new Intro({
    			props: {
    				text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tempor ex in quam molestie, vitae ultricies lectus euismod. Integer ac ex imperdiet, rhoncus augue eu, volutpat lorem. Suspendisse luctus purus eros, vitae volutpat dui accumsan sagittis. Fusce accumsan accumsan accumsan. Phasellus vestibulum mollis turpis sit amet euismod. Duis hendrerit, eros faucibus euismod tincidunt, massa sapien tempus sapien, quis sollicitudin turpis erat non arcu. Nullam ut hendrerit justo. Aenean vitae eros dolor. Donec in magna sit amet sapien aliquet semper id et nibh. Suspendisse elementum sem vitae tincidunt fermentum. Phasellus sit amet elit ipsum. Fusce sit amet mi eget lacus pellentesque dignissim. Vivamus dictum vel enim ac faucibus. Morbi sed aliquet arcu, quis euismod nisl. Vestibulum scelerisque pharetra ligula, a porttitor metus semper et. Sed non eros tincidunt, porttitor enim at, cursus felis. Suspendisse pharetra eget dolor vel maximus. Proin convallis enim non quam egestas, eu facilisis ligula luctus. Mauris dapibus risus sit amet ex congue, sodales porttitor neque tempor. Ut in euismod arcu, vel faucibus tellus. Integer eu justo at leo sagittis dictum. Nullam scelerisque lorem eu arcu tincidunt maximus. Donec at mi dignissim, tempor nisl quis, lobortis metus. Donec elit sem, porttitor ac mauris nec, posuere mollis mi. Curabitur blandit lorem nec malesuada tincidunt. Etiam urna libero, viverra quis elit sit amet, dignissim sagittis nisi. Praesent eu interdum mi. Nam ut velit cursus, tincidunt felis tempus, hendrerit nulla. Nullam consequat purus ut justo condimentum, a cursus magna scelerisque. Nunc congue lacus viverra porta auctor. Aenean condimentum venenatis velit non commodo. Donec non nunc lacinia, sagittis orci ut, suscipit urna. Aenean ex quam, pellentesque sit amet turpis vitae, auctor tincidunt ligula. Etiam cursus, velit in pulvinar vestibulum, lacus velit sodales justo, ac porttitor urna lorem at ipsum. Vivamus massa nibh, elementum ornare neque et, sollicitudin laoreet eros. Sed volutpat ante."
    			},
    			$$inline: true
    		});

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			script = element("script");
    			t0 = space();
    			main = element("main");
    			create_component(intro.$$.fragment);
    			t1 = space();
    			create_component(footer.$$.fragment);
    			if (!src_url_equal(script.src, script_src_value = "https://data.id.tue.nl/api/v1/1335/anonymousParticipation.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file, 73, 2, 2239);
    			attr_dev(main, "class", "svelte-jtxsde");
    			add_location(main, file, 79, 0, 2391);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(intro, main, null);
    			append_dev(main, t1);
    			mount_component(footer, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(script, "load", /*initializeParticipation*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro$1(local) {
    			if (current) return;
    			transition_in(intro.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(intro.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(intro);
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
    	let story = new Ink.Story(storyJson);

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
    			participantLoaded = true;
    		}

    		// TESTING
    		participantLoaded = true;
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
    		story,
    		prompts,
    		testOpinions,
    		participantLoaded,
    		initializeParticipation
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentPrompt' in $$props) currentPrompt = $$props.currentPrompt;
    		if ('story' in $$props) story = $$props.story;
    		if ('participantLoaded' in $$props) participantLoaded = $$props.participantLoaded;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [initializeParticipation];
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
