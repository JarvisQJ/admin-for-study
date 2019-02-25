'use strict';

const Service = require('egg').Service;
const OSS = require('ali-oss');
const STS = OSS.STS;

class Oss extends Service {
  async stsToken() {
    const sts = new STS({
      accessKeyId: this.ctx.app.config.oss.accessKeyId,
      accessKeySecret: this.ctx.app.config.oss.accessKeySecret
    });
    const bucketName = this.ctx.app.config.oss.bucketName;
    const policy = {
      Version: '1',
      Statement: [
        {
          Action: [
            'oss:GetObject',
            'oss:ListObjects',
            'oss:PutObject',
            'oss:DeleteObject'
          ],
          Resource: [
            'acs:oss:*:*:' + bucketName + '/*'
          ],
          Effect: 'Allow'
        }
      ]
    };
    try {
      const token = await sts.assumeRole('acs:ram::1618393884781242:role/readandwrite', policy, 3600, '001');
      return Object.assign({}, token.credentials, {BucketName: bucketName});
    } catch (e) {
      throw e;
    }
  }


}

module.exports = Oss;