import Core from '@idraw/core';
import {
  TypeData,
  TypeCoreOptions,
  TypeConfig,
} from '@idraw/types';

type Options = {
  maxRecords?: number;
} & TypeCoreOptions;

type PrivateOptions = {
  maxRecords: number;
} & Options;

type Record = {
  data: TypeData;
  time: number;
}

const _opts = Symbol('_opts');
const _doRecords = Symbol('_doRecords');
const _unDoRecords = Symbol('_unDoRecords');
const _hasInited = Symbol('_hasInited');
const _initEvent = Symbol('_initEvent');

class IDraw extends Core {

  private [_opts]: PrivateOptions;
  private [_doRecords]: Record[] = [];
  private [_unDoRecords]: Record[] = [];
  private [_hasInited] = false; 

  constructor(mount: HTMLDivElement, opts: Options, config?: TypeConfig) {
    super(mount, {
      width: opts.width,
      height: opts.height,
      contextWidth: opts.contextWidth,
      contextHeight: opts.contextHeight,
      devicePixelRatio: opts.devicePixelRatio
    }, config || {});
    this[_opts] = this._createOpts(opts);
    this[_initEvent]();
  }

  undo() {
    if (!(this[_doRecords].length > 1)) {
      return this[_doRecords].length;
    }
    const popRecord = this[_doRecords].pop();
    if (popRecord) {
      this[_unDoRecords].push(popRecord);
    }
    const record = this[_doRecords][this[_doRecords].length - 1];
    if (record?.data) {
      this.setData(record.data);
      this.draw();
    }
    return this[_doRecords].length;
  }

  redo() {
    if (!(this[_unDoRecords].length > 0)) {
      return this[_unDoRecords].length;
    }
    const record = this[_unDoRecords].pop();
    if (record?.data) {
      this.setData(record.data);
      this.draw();
    }
    return this[_unDoRecords].length;
  }

  private [_initEvent]() {
    if (this[_hasInited] === true) {
      return;
    }
    this.on('changeData', (data: TypeData) => {
      this._pushRecord(data);
    });
    this[_hasInited] = true;
  }

  private _pushRecord(data: TypeData) {
    if (this[_doRecords].length >= this[_opts].maxRecords) {
      this[_doRecords].shift();
    }
    this[_doRecords].push({ data, time: Date.now() })
    this[_unDoRecords] = [];
  }

  private _createOpts(opts: Options): PrivateOptions {
    const defaultOpts = {
      maxRecords: 10,
    }
    return { ...defaultOpts, ...opts }
  }
}

export default IDraw;