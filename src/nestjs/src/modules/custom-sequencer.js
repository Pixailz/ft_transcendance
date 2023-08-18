const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
    /**
     * Sort test to determine order of execution
     * Sorting is applied after sharding
     */
    sort(tests) {
        // Test structure information
        // https://github.com/jestjs/jest/blob/6b8b1404a1d9254e7d5d90a8934087a9c9899dab/packages/jest-runner/src/types.ts#L17-L21
        let sorted_tests_array = [];
        let sorted_array = [
            "/shared/transcendence/src/modules/database/user/service.spec.ts",
            "/shared/transcendence/src/modules/database/chatRoom/service.spec.ts",
            "/shared/transcendence/src/modules/database/userChatRoom/service.spec.ts"
        ]
        for (let i = 0; i < sorted_array.length; i++)
        {
            for (let j = 0; j < sorted_array.length; j++)
            {
                if (tests[j].path == sorted_array[i])
                    sorted_tests_array.push(tests[j])
            }
        }
        return sorted_tests_array;
    }
}

module.exports = CustomSequencer;