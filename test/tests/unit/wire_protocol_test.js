'use strict';

const chai = require('chai');
const expect = chai.expect;
const bson = require('bson');
const sinon = require('sinon');
const Pool = require('../../../lib/connection/pool.js');
const wireProtocol = require('../../../lib/wireprotocol');

describe('WireProtocol', function() {
  it('should only set bypassDocumentValidation to true if explicitly set by user to true', function() {
    testPoolWrite(true, true);
  });

  it('should not set bypassDocumentValidation to anything if not explicitly set by user to true', function() {
    testPoolWrite(false, undefined);
  });

  function testPoolWrite(bypassDocumentValidation, expected) {
    const pool = sinon.createStubInstance(Pool);
    const fakeServer = { s: { pool, bson } };
    const ns = 'fake.namespace';
    const ops = [{ a: 1 }, { b: 2 }];
    const options = { bypassDocumentValidation: bypassDocumentValidation };

    wireProtocol.insert(fakeServer, ns, ops, options, () => {});

    if (expected) {
      expect(pool.write.lastCall.args[0])
        .to.have.nested.property('query.bypassDocumentValidation')
        .that.equals(expected);
    } else {
      expect(pool.write.lastCall.args[0]).to.not.have.nested.property(
        'query.bypassDocumentValidation'
      );
    }
  }
});
