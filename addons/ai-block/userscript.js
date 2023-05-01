const BlockType = require('./extension-support/block-type');
const ArgumentType = require('./extension-support/argument-type');
const TargetType = require('./extension-support/target-type');

class AiBlock {

  constructor (runtime) {
      // put any setup for your extension here
  }

  /**
   * Returns the metadata about your extension.
   */
  getInfo () {
      return {
          // unique ID for your extension
          id: 'AIBlock',

          // name that will be displayed in the Scratch UI
          name: 'Demo',

          // colours to use for your extension blocks
          color1: '#000099',
          color2: '#660066',

          // icons to display
          blockIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',
          menuIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',

          // your Scratch blocks
          blocks: [
              {
                  // name of the function where your block code lives
                  opcode: 'completePrompt',

                  // type of block - choose from:
                  //   BlockType.REPORTER - returns a value, like "direction"
                  //   BlockType.BOOLEAN - same as REPORTER but returns a true/false value
                  //   BlockType.COMMAND - a normal command block, like "move {} steps"
                  //   BlockType.HAT - starts a stack if its value changes from false to true ("edge triggered")
                  blockType: BlockType.REPORTER,

                  // label to display on the block
                  text: 'complete Prompt [MY_STRING]',

                  // true if this block should end a stack
                  terminal: false,

                  // where this block should be available for code - choose from:
                  //   TargetType.SPRITE - for code in sprites
                  //   TargetType.STAGE  - for code on the stage / backdrop
                  // remove one of these if this block doesn't apply to both
                  filter: [ TargetType.SPRITE, TargetType.STAGE ],
                      MY_STRING: {
                          // default value before the user sets something
                          defaultValue: 'hello',

                          // type/shape of the parameter - choose from:
                          //     ArgumentType.ANGLE - numeric value with an angle picker
                          //     ArgumentType.BOOLEAN - true/false value
                          //     ArgumentType.COLOR - numeric value with a colour picker
                          //     ArgumentType.NUMBER - numeric value
                          //     ArgumentType.STRING - text value
                          //     ArgumentType.NOTE - midi music value with a piano picker
                          type: ArgumentType.STRING
                      }
                  }
          ]
      };
  }


  /**
   * implementation of the block with the opcode that matches this name
   *  this will be called when the block is used
   */
  completePrompt({ MY_STRING }) {
      //Remove trailing spaces, required for model to work properly
      const text = MY_STRING.trim();
      //Request text completion using Davinci3
      const url = `https://api.openai.com/v1/engines/text-davinci-003/completions`;

      const options = {
          //Has to be post for some reason
          method: "POST",
          //Input prompt and a decent length
          body: JSON.stringify({
              prompt: text,
              max_tokens: 300,
          }),
          //API key, and JSON content type
          headers: {
              Authorization: "Bearer " + "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",
              "Content-type": "application/json; charset=UTF-8"
          },
      };

      console.log("REQUEST:" + url);

      return fetch(url, options).json().choices[0].text;
  }
}

module.exports = AiBlock;
